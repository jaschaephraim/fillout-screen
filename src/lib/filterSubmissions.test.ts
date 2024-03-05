// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, test } from '@jest/globals';
import { Submission } from 'services/fillout';

import {
  Filter,
  applySubmissionFilters,
  comparisonFromFilter,
} from './filterSubmissions';

describe('comparisonFromFilter', () => {
  test('string equals', () => {
    const comparison = comparisonFromFilter({
      id: 'name',
      condition: 'equals',
      value: 'pat',
    });
    expect(comparison('jesse')).toBe(false);
    expect(comparison('pat')).toBe(true);
  });

  test('number greater_than', () => {
    const comparison = comparisonFromFilter({
      id: 'quantity',
      condition: 'greater_than',
      value: 5,
    });
    expect(comparison('2')).toBe(false);
    expect(comparison('8')).toBe(true);
  });

  test('datetime less_than', () => {
    const comparison = comparisonFromFilter({
      id: 'submitted',
      condition: 'less_than',
      value: '2024-05-16T23:20:05.324Z',
    });
    expect(comparison('2024-06-16T23:20:05.324Z')).toBe(false);
    expect(comparison('2024-05-16T23:20:05.314Z')).toBe(true);
  });
});

describe('applySubmissionFilters', () => {
  const submissions: Submission[] = [
    {
      submissionId: 'abc',
      submissionTime: '2024-05-16T23:19:05.324Z',
      questions: [
        {
          id: 'name',
          name: 'Name',
          type: 'ShortAnswer',
          value: 'Jo',
        },
        {
          id: 'age',
          name: 'Age',
          type: 'NumberInput',
          value: '27',
        },
      ],
      calculations: [],
      urlParameters: [],
    },
    {
      submissionId: 'def',
      submissionTime: '2024-05-16T23:20:05.324Z',
      questions: [
        {
          id: 'name',
          name: 'Name',
          type: 'ShortAnswer',
          value: 'Pat',
        },
        {
          id: 'age',
          name: 'Age',
          type: 'NumberInput',
          value: '32',
        },
      ],
      calculations: [],
      urlParameters: [],
    },
  ];

  test('0 filtered out', () => {
    const filters: Filter[] = [
      {
        id: 'name',
        condition: 'does_not_equal',
        value: 'Sam',
      },
      {
        id: 'age',
        condition: 'less_than',
        value: 52,
      },
    ];

    const filteredSubmissions = applySubmissionFilters(submissions, filters);
    expect(filteredSubmissions).toHaveLength(2);
  });

  test('1 filtered out', () => {
    const filters: Filter[] = [
      {
        id: 'name',
        condition: 'equals',
        value: 'Jo',
      },
      {
        id: 'age',
        condition: 'less_than',
        value: 52,
      },
    ];

    const filteredSubmissions = applySubmissionFilters(submissions, filters);
    expect(filteredSubmissions).toHaveLength(1);
  });

  test('2 filtered out', () => {
    const filters: Filter[] = [
      {
        id: 'name',
        condition: 'does_not_equal',
        value: 'Sam',
      },
      {
        id: 'age',
        condition: 'less_than',
        value: 19,
      },
    ];

    const filteredSubmissions = applySubmissionFilters(submissions, filters);
    expect(filteredSubmissions).toHaveLength(0);
  });
});
