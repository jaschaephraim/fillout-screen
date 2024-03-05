import {
  getSubmissions,
  Submission,
  type GetSubmissionsQueryParams,
} from 'services/fillout';
import * as z from 'zod';

const MAX_LIMIT = 150;

// Schema and type of a single filter
export const FilterSchema = z.object({
  id: z.string(),
  condition: z.enum(['equals', 'does_not_equal', 'greater_than', 'less_than']),
  value: z.union([z.number(), z.string()]),
});
export type Filter = z.infer<typeof FilterSchema>;

// Get a function to perform the comparison specified by the condition string
export function comparisonFromFilter({
  condition,
  value: filterValue,
}: Filter) {
  // Convert input value to number if specified filter value is numeric
  const convertValue =
    typeof filterValue === 'number'
      ? (value: string) => Number(value)
      : (value: string) => value;

  switch (condition) {
    case 'equals':
      return (value: string) => convertValue(value) === filterValue;
    case 'does_not_equal':
      return (value: string) => convertValue(value) !== filterValue;
    case 'greater_than':
      return (value: string) => convertValue(value) > filterValue;
    case 'less_than':
      return (value: string) => convertValue(value) < filterValue;
    default:
      throw new Error(`unexpected filter condition '${condition}'`);
  }
}

// Apply array of filters to an array of submissions
export function applySubmissionFilters(
  submissions: Submission[],
  filters: Filter[]
) {
  let filteredSubmissions = submissions;

  filters.forEach((filter) => {
    filteredSubmissions = filteredSubmissions.filter(({ questions }) =>
      questions.some((question) => {
        const comparison = comparisonFromFilter(filter);
        return question.id === filter.id && comparison(question.value);
      })
    );
  });

  return filteredSubmissions;
}

// Fetch all available form submissions for a given formId and query variables,
// ignoring limit and offset
async function fetchAllSubmissionsForQuery(
  formId: string,
  queryParams: GetSubmissionsQueryParams
) {
  // Fetch the first page of submissions to determine total number of pages
  const pagedQueryParams = { ...queryParams, limit: MAX_LIMIT, offset: 0 };
  const response = await getSubmissions(formId, pagedQueryParams);

  // If we've already fetched the only page of submissions, return what we've got
  let submissions = response.responses;
  const { pageCount } = response;
  if (pageCount < 2) {
    return submissions;
  }

  // If there are more pages of submissions, continue concatenating until we have them all
  for (let page = 1; page <= pageCount; page++) {
    pagedQueryParams.offset = MAX_LIMIT * page;
    const { responses: pageSubmissions } = await getSubmissions(
      formId,
      pagedQueryParams
    );
    submissions = submissions.concat(pageSubmissions);
  }
  return submissions;
}

// Fetch all available form submissions for a given formId and query variables,
// filter the results, apply requested limit and offset,
// return results with relevant totals
export default async function filterSubmissions(
  formId: string,
  queryParams: GetSubmissionsQueryParams,
  filters: Filter[]
) {
  const submissions = await fetchAllSubmissionsForQuery(formId, queryParams);
  const filteredSubmissions = applySubmissionFilters(submissions, filters);

  const offset = queryParams.offset ?? 0;
  const limit = queryParams.limit ?? 150;
  const responses = filteredSubmissions.slice(offset, offset + limit);
  const totalResponses = filteredSubmissions.length;
  const pageCount = Math.ceil(totalResponses / limit);
  return { responses, totalResponses, pageCount };
}
