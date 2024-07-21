import { add, differenceInDays } from "date-fns";
import { RuleType } from "react-querybuilder";
import { isValidDate } from "./date-validation";
import { fields } from "@/config/fields";

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
          not: {
            gte: value,
            lte: endDate && isValidDate(endDate.toDateString()) ? endDate : value,
          },
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
              value < endDate ? value : endDate
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
export function convertToPrismaQuery(query: Query): any {
  const { combinator, rules } = query;

  if (!rules || rules.length === 0) return {};

  /**
   * Builds the Prisma query from the rules.
   *
   * @param rules - The array of rule objects.
   * @returns An array of conditions for the Prisma query.
   */
  const buildPrismaQuery = (rules: (Rule | NestedRule)[]): any[] => {
    return rules.map((rule: Rule | NestedRule) => {
      if ('rules' in rule) {
        // Recursively handle nested rules
        return convertToPrismaQuery(rule as NestedRule);
      }

      const { field, operator, value } = rule as Rule;

      // Ensure value is correctly typed
      const fieldData = fields.find((item) => item.name === field);
      const typedValue = (() => {
        if (!fieldData) {
          throw new Error("Field data was not found in the field list.");
        }

        switch (fieldData.datatype) {
          case "date":
            const [startDateStr, endDateStr] = value.split(",");
            if (startDateStr && endDateStr && !isNaN(Date.parse(startDateStr)) && !isNaN(Date.parse(endDateStr))) {
              return [new Date(startDateStr), new Date(endDateStr)];
            }
            if (!isNaN(Date.parse(value))) {
              return [new Date(value)];
            }
            return [];
          case "number":
            const isRange = value?.includes('-');

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

      // Type guard to ensure typedValue is an array when accessing indices
      const isArray = Array.isArray(typedValue);
      const startValue = isArray ? typedValue[0] : typedValue;
      const endValue = isArray && typedValue.length > 1 ? typedValue[1] : undefined;

      const _field = field.includes(".") ? field.split('.') : ['', field];

      // Build the condition based on the operator and typed value
      const condition: any = (() => {
        if (fieldData.datatype === 'date') {
          return buildDateRangeCondition(
            _field[1],
            startValue as Date,
            operator,
            endValue as Date
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
            return {
              [_field[1]]: { gte: parseInt((typedValue as string).split("-")[0]), lte: parseInt((typedValue as string).split("-")[1]) },
            };
          case "notBetween":
            return {
              [_field[1]]: {
                not: { gte: parseInt((typedValue as string).split("-")[0]), lte: parseInt((typedValue as string).split("-")[1]) },
              },
            };
          default:
            return {};
        }
      })();

      // Handle nested fields
      if (field.indexOf(".") !== -1) {
        return { [_field[0]]: condition };
      }
      console.log(condition)

      return condition;
    });
  };

  // Build the Prisma query using the rules
  const prismaQuery = buildPrismaQuery(rules);

  // Combine conditions using the specified combinator (AND/OR), if there are conditions
  if (prismaQuery.length > 0) {
    return combinator === "and"
      ? { AND: prismaQuery }
      : combinator === "or"
      ? { OR: prismaQuery }
      : prismaQuery[0]; // Return the first condition if no combinator is specified
  }

  return {};
}
