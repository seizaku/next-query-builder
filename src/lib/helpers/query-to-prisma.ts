import { add, differenceInDays, sub } from "date-fns";
import { RuleType } from "react-querybuilder";
import { isValidDate } from "./date-validation";
import { fields } from "@/config/fields";

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
          lte: isValidDate(endDate!.toDateString()) ? endDate : value,
        },
      };
    case "notBetween":
      return {
        [field]: {
          not: {
            gte: value,
            lte: isValidDate(endDate!.toDateString()) ? endDate : value,
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
      return {
        [field]: {
          gte: new Date(),
          lte: add(value, {
            days: differenceInDays(
              value > endDate! ? value : endDate!,
              value < endDate! ? value : endDate!,
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
export function convertToPrismaQuery(query: any) {
  const { combinator, rules } = query;
  if (!rules || rules.length === 0) return {};

  /**
   * Builds the Prisma query from the rules.
   *
   * @param rules - The array of rule objects.
   * @returns An array of conditions for the Prisma query.
   */
  const buildPrismaQuery = (rules: RuleType[]) => {
    return rules.map((rule: RuleType) => {
      const { field, operator, value } = rule;

      // Ensure value is correctly typed
      const fieldData = fields.find((item) => item.name == field);
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
            // Check for single date value
            if (!isNaN(Date.parse(value))) {
              return new Date(value);
            }
            break;
          case "number":
            console.log("THIS IS NOT CONSIDERED NUMERIC")
            const numericValue = Number(value);
            if (!isNaN(numericValue) && isFinite(numericValue)) {
              return numericValue;
            }
          default:
            return value;
        }
      })();    
      // Build the condition based on the operator and typed value
      const condition: any = (() => {
        if (fieldData.datatype == 'date') {
          return buildDateRangeCondition(
            field,
            typedValue[0] || typedValue,
            operator,
            typedValue[1],
          );
        }

        switch (operator) {
          case "=":
            return { [field]: typedValue };
          case "!=":
            return { [field]: { not: typedValue } };
          case "<":
            return { [field]: { lt: typedValue } };
          case ">":
            return { [field]: { gt: typedValue } };
          case "<=":
            return { [field]: { lte: typedValue } };
          case ">=":
            return { [field]: { gte: typedValue } };
          case "contains":
            return { [field]: { contains: typedValue } };
          case "doesNotContain":
            return { [field]: { not: { contains: typedValue } } };
          case "notNull":
            return { [field]: { not: null } };
          case "null":
            return { [field]: null };
          case "between":
            return {
              [field]: { gte: parseInt(typedValue.split("-")[0]), lte: parseInt(typedValue.split("-")[1]) },
            };
          case "notBetween":
            return {
              [field]: {
                not: { gte: parseInt(typedValue.split("-")[0]), lte: parseInt(typedValue.split("-")[1]) },
              },
            };
          default:
            return {};
        }
      })();

      // Handle nested fields
      if (field.indexOf(".") !== -1) {
        const nested = field.split(".");
        return { [nested[0]]: { [nested[1]]: condition[field] } };
      }

      return condition;
    });
  };

  // Build the Prisma query using the rules
  const prismaQuery = buildPrismaQuery(rules);

  console.log(prismaQuery);

  // Combine conditions using the specified combinator (AND/OR), if there are conditions
  if (prismaQuery.length > 0) {
    return combinator === "and"
      ? { AND: prismaQuery }
      : combinator === "or"
      ? { OR: prismaQuery }
      : prismaQuery[0]; // Return the first condition if no combinator is specified
  }

  console.group(prismaQuery);
  return {};
}
