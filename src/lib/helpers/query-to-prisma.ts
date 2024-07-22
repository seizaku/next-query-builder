import { add, differenceInDays } from "date-fns";
import { RuleType } from "react-querybuilder";
import { isValidDate } from "./date-validation";
import { fields } from "@/config/fields";
import { RuleGroupType } from "../stores/query-builder-store";

// Define types for query and rule
interface Query {
  combinator: "and" | "or";
  rules: (Rule | NestedRule)[];
}

interface Rule {
  field: string;
  operator: string;
  value: string;
}

interface NestedRule extends Omit<Rule, "field" | "operator" | "value"> {
  combinator: "and" | "or";
  rules: (Rule | NestedRule)[];
}

// Type guard to check if an item is a RuleType
const isRuleType = (item: RuleType | RuleGroupType): item is RuleType => {
  return (item as RuleType).field !== undefined;
};

// Type guard to check if an item is a RuleGroupType
const isRuleGroupType = (
  item: RuleType | RuleGroupType,
): item is RuleGroupType => {
  return (item as RuleGroupType).combinator !== undefined;
};

/**
 * Builds a date range condition for a given field, date, operator, and optional end date.
 *
 * @param field - The field to apply the condition to.
 * @param date - The date to use as the basis for the condition.
 * @param operator - The operator to use for the condition.
 * @param endDate - The optional end date for range conditions.
 * @returns An object representing the Prisma query condition.
 */
const buildDateRangeCondition = (
  field: string,
  date: Date,
  operator: string,
  endDate?: Date,
) => {
  if (!date) return {};

  // Shift date by 1 day and set the end of the day
  let value = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  value.setUTCHours(23, 59, 59, 999);

  // Get the start of the day for the input date
  const startOfDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  startOfDay.setUTCHours(0, 0, 0, 0);

  switch (operator) {
    case "=":
      return { [field]: { gte: startOfDay, lte: value } };
    case "!=":
      return {
        OR: [{ [field]: { lt: startOfDay } }, { [field]: { gt: value } }],
      };
    case "<":
      return { [field]: { lt: value } };
    case "<=":
      return { [field]: { lte: value } };
    case ">":
      return { [field]: { gt: value } };
    case ">=":
      return { [field]: { gte: value } };
    case "between":
      return {
        [field]: {
          gte: value,
          lte: endDate && isValidDate(endDate.toDateString()) ? endDate : value,
        },
      };
    case "notBetween":
      return {
        [field]: {
          OR: [
            { [field]: { lt: startOfDay } }, // Dates before the start of the range
            {
              [field]: {
                gt:
                  endDate && isValidDate(endDate.toDateString())
                    ? endDate
                    : value,
              },
            }, // Dates after the end of the range
          ],
        },
      };
    case "last":
      return { [field]: { gte: value, lte: endDate } };
    case "notLast":
      return {
        [field]: {
          not: { gte: value, lte: endDate },
        },
      };
    case "beforeLast":
      return { [field]: { lt: new Date(date.setUTCHours(0, 0, 0, 0)) } };
    case "since":
      return { [field]: { gte: new Date(date.setUTCHours(0, 0, 0, 0)) } };
    case "next":
      if (!endDate) return {};
      return {
        [field]: {
          gte: new Date(),
          lte: add(value, {
            days: differenceInDays(
              value > endDate ? value : endDate,
              value < endDate ? value : endDate,
            ),
          }),
        },
      };
    default:
      return {};
  }
};

/**
 * Converts a query builder query to a Prisma query.
 *
 * @param query - The query builder query object.
 * @returns An object representing the Prisma query.
 */
/**
 * Converts a query builder query to a Prisma query.
 *
 * @param query - The query builder query object.
 * @returns An object representing the Prisma query.
 */
export function convertToPrismaQuery(query: Query): any {
  const { combinator, rules } = query;

  if (!rules || rules.length === 0) return {};

  // Function to build Prisma conditions based on rules
  const buildPrismaQuery = (rules: Array<RuleType | RuleGroupType>): any[] => {
    return rules.map((rule) => {
      if (isRuleGroupType(rule)) {
        // Recursively handle nested rule groups
        return convertToPrismaQuery(rule as RuleGroupType);
      }

      const { field, operator, value } = rule as RuleType;
      const fieldData = fields.find((item) => item.name === field);
      const typedValue = (() => {
        if (!fieldData) {
          throw new Error("Field data was not found in the field list.");
        }

        switch (fieldData.datatype) {
          case "date":
            const [startDateStr, endDateStr] = value.split(",");
            if (
              startDateStr &&
              endDateStr &&
              !isNaN(Date.parse(startDateStr)) &&
              !isNaN(Date.parse(endDateStr))
            ) {
              return [new Date(startDateStr), new Date(endDateStr)];
            }
            if (!isNaN(Date.parse(value))) {
              return [new Date(value)];
            }
            return [];
          case "number":
            const isRange = value?.includes("-");
            if (isRange) {
              return value;
            }
            const numericValue = Number(value);
            if (!isNaN(numericValue) && isFinite(numericValue)) {
              return numericValue;
            }
            return [];
          default:
            return value;
        }
      })();

      const isArray = Array.isArray(typedValue);
      const startValue = isArray ? typedValue[0] : typedValue;
      const endValue =
        isArray && typedValue.length > 1 ? typedValue[1] : undefined;

      const _field = field.includes(".") ? field.split(".") : ["", field];

      const condition: any = (() => {
        if (fieldData.datatype === "date") {
          return buildDateRangeCondition(
            _field[1],
            startValue as Date,
            operator,
            endValue as Date,
          );
        }

        switch (operator) {
          case "=":
            return { [_field[1]]: typedValue };
          case "!=":
            return { [_field[1]]: { not: typedValue } };
          case "<":
            return { [_field[1]]: { lt: typedValue } };
          case ">":
            return { [_field[1]]: { gt: typedValue } };
          case "<=":
            return { [_field[1]]: { lte: typedValue } };
          case ">=":
            return { [_field[1]]: { gte: typedValue } };
          case "contains":
            return { [_field[1]]: { contains: typedValue } };
          case "doesNotContain":
            return { [_field[1]]: { not: { contains: typedValue } } };
          case "notNull":
            return { [_field[1]]: { not: null } };
          case "null":
            return { [_field[1]]: null };
          case "between":
            if (!(typedValue as string).includes("-")) {
              return {};
            }
            return {
              [_field[1]]: {
                gte: parseInt((typedValue as string).split("-")[0]),
                lte: parseInt((typedValue as string).split("-")[1]),
              },
            };
          case "notBetween":
            if (!(typedValue as string).includes("-")) {
              return {};
            }
            const [min, max] = (typedValue as string)
              .split("-")
              .map((val) => parseInt(val.trim(), 10));

            return {
              OR: [{ [_field[1]]: { lt: min } }, { [_field[1]]: { gt: max } }],
            };
          default:
            return {};
        }
      })();

      if (field.indexOf(".") !== -1) {
        return { [_field[0]]: condition };
      }
      return condition;
    });
  };
  
  // Function to determine the top-level combinator
  const determineTopLevelCombinator = (
    rules: Array<RuleType | RuleGroupType>,
  ): "AND" | "OR" => {
    let topLevelCombinator: "AND" | "OR" = "AND";

    for (const rule of rules) {
      if (isRuleGroupType(rule)) {
        if (rule.groupCombinator === "or") {
          topLevelCombinator = "OR";
        } else if (rule.groupCombinator === "and") {
          const innerCombinator = determineTopLevelCombinator(rule.rules);
          if (innerCombinator === "OR") {
            topLevelCombinator = "OR";
          }
        }
      }
    }

    return topLevelCombinator;
  };

  const topLevelCombinator = determineTopLevelCombinator(rules);

  // Flatten the conditions into a single array
  const flattenedConditions = buildPrismaQuery(rules);

  return { [topLevelCombinator]: flattenedConditions };
}
