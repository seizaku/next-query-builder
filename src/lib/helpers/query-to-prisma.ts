import { RuleType } from "react-querybuilder";

function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
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
const buildDateRangeCondition = (field: string, date: Date, operator: string, endDate?: Date) => {
  // Shift date by 1 day and set the end of the day
  let value = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  value.setUTCHours(23, 59, 59, 999);

  // Get the start of the day for the input date
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  switch (operator) {
    case '=':
      return { [field]: { gte: startOfDay, lte: value } };
    case '!=':
      return { [field]: { not: { gte: startOfDay, lte: value } } };
    case '<':
      return { [field]: { lt: value } };
    case '<=':
      return { [field]: { lte: value } };
    case '>':
      return { [field]: { gt: value } };
    case '>=':
      return { [field]: { gte: value } };
    case 'between':
      return { [field]: { gte: value, lte: isValidDate(endDate!.toDateString()) ? endDate : value } };
    case 'notBetween':
      return { [field]: { not: { gte: value, lte: isValidDate(endDate!.toDateString()) ? endDate : value } } };
    case 'last':
      return { [field]: { gte: value, lte: endDate } };
    case 'notLast':
      return { [field]: { not: { gte: new Date(Date.now() - Number(value) * 24 * 60 * 60 * 1000) } } };
    case 'beforeLast':
      return { [field]: { lt: new Date(Date.now() - Number(value) * 24 * 60 * 60 * 1000) } };
    case 'since':
      return { [field]: { gte: new Date(Date.now() - Number(value) * 24 * 60 * 60 * 1000) } };
    case 'next':
      return { [field]: { lte: new Date(Date.now() + Number(value) * 24 * 60 * 60 * 1000) } };
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
      const typedValue = (() => {
        if (typeof value === 'string' && value.includes(',') && !isNaN(Date.parse(value.split(',')[0]))) {
          const range = value.split(',');
          return [new Date(range[0]), new Date(range[1])];
        } else if (typeof value === 'string' && !isNaN(Number(value))) {
          return Number(value);
        } else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
          return new Date(value);
        }
        return value;
      })();

      // Build the condition based on the operator and typed value
      const condition = (() => {
        if (typeof value === 'string' && (value.includes(',') && !isNaN(Date.parse(value.split(',')[0]))) || !isNaN(Date.parse(value))) {
          return buildDateRangeCondition(field, typedValue[0] || typedValue, operator, typedValue[1]);
        }

        switch (operator) {
          case '=':
            return { [field]: typedValue };
          case '!=':
            return { [field]: { not: typedValue } };
          case '<':
            return { [field]: { lt: typedValue } };
          case '>':
            return { [field]: { gt: typedValue } };
          case '<=':
            return { [field]: { lte: typedValue } };
          case '>=':
            return { [field]: { gte: typedValue } };
          case 'contains':
            return { [field]: { contains: typedValue } };
          case 'doesNotContain':
            return { [field]: { not: { contains: typedValue } } };
          case 'notNull':
            return { [field]: { not: null } };
          case 'null':
            return { [field]: null };
          case 'between':
            return { [field]: { gte: typedValue[0], lte: typedValue[1] } };
          case 'notBetween':
            return { [field]: { not: { gte: typedValue[0], lte: typedValue[1] } } };
          default:
            return {};
        }
      })();

      // Handle nested fields
      if (field.indexOf('.') !== -1) {
        const nested = field.split('.');
        return { [nested[0]]: { [nested[1]]: condition[field] } };
      }

      return condition;
    });
  };

  // Build the Prisma query using the rules
  const prismaQuery = buildPrismaQuery(rules);

  console.log(prismaQuery);

  // Combine conditions using the specified combinator (AND/OR)
  if (combinator === 'and') {
    return { AND: prismaQuery };
  } else if (combinator === 'or') {
    return { OR: prismaQuery };
  }
  return {};
}
