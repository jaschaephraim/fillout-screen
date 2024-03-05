import { RequestHandler } from 'express';
import filterSubmissions, { FilterSchema } from 'lib/filterSubmissions';
import { GetSubmissionsQueryParamsSchema } from 'services/fillout';
import * as z from 'zod';
import { zu } from 'zod_utilz';

const QueryParamsSchema = GetSubmissionsQueryParamsSchema.extend({
  filters: zu.stringToJSON().pipe(z.array(FilterSchema)).optional(),
});

const getFilteredResponses: RequestHandler<{ formId: string }> = async (
  { params: { formId }, query },
  res,
  next
) => {
  // Parse and type query variables, including filters as JSON strings
  const queryParse = QueryParamsSchema.safeParse(query);
  if (!queryParse.success) {
    res.status(400).json({
      error: 'improperly formatted query variables',
      issues: queryParse.error.issues,
    });
    return;
  }

  const { filters, ...queryParams } = queryParse.data;
  try {
    const response = await filterSubmissions(
      formId,
      queryParams,
      filters ?? []
    );
    res.json(response);
  } catch (err) {
    next(err);
  }
};

export default getFilteredResponses;
