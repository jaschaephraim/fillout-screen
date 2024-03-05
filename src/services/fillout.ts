import { Axios } from 'axios';
import env from 'env';
import * as z from 'zod';

// Client for interacting with the Fillout API
const filloutClient = new Axios({
  baseURL: 'https://api.fillout.com/v1/api',
  headers: {
    Authorization: `Bearer ${env.FILLOUT_API_KEY}`,
  },

  // Manually parsing JSON response since Axios wasn't doing so reliably
  transformResponse: [
    (data) => {
      if (typeof data !== 'string') {
        return data;
      }

      try {
        return JSON.parse(data);
      } catch (err) {
        throw new Error('unable to parse response from Fillout API');
      }
    },
  ],
});

// Schema and type for submissions endpoint query params
export const GetSubmissionsQueryParamsSchema = z.object({
  limit: z.coerce.number().gte(1).lte(150).optional(),
  afterDate: z.string().datetime().optional(),
  beforeDate: z.string().datetime().optional(),
  offset: z.coerce.number().gte(0).optional(),
  status: z.enum(['in_progress', 'finished']).optional(),
  includeEditLink: z.coerce.boolean().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
});
export type GetSubmissionsQueryParams = z.infer<
  typeof GetSubmissionsQueryParamsSchema
>;

// Type of a single form submission
export type Submission = {
  questions: {
    id: string;
    name: string;
    type: string;
    value: string;
  }[];
  calculations: {
    id: string;
    name: string;
    type: string;
    value: string;
  }[];
  urlParameters: {
    id: string;
    name: string;
    value: string;
  }[];
  quiz?: {
    score: number;
    maxScore: number;
  };
  submissionId: string;
  submissionTime: string;
};

// Type of submissions endpoint response
type GetSubmissionsResponse = {
  responses: Submission[];
  totalResponses: number;
  pageCount: number;
};

// Get response body from submissions endpoint for given formId and query params
export async function getSubmissions(
  formId: string,
  queryParams: GetSubmissionsQueryParams
) {
  const endpoint = `/forms/${formId}/submissions`;
  const response = await filloutClient.get<GetSubmissionsResponse>(endpoint, {
    params: queryParams,
  });

  if (response.status >= 400) {
    throw new Error('unable to fetch submissions from fillout API');
  }
  return response.data;
}
