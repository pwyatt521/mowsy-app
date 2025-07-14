import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../../constants/config';
import { RootState } from '../index';

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Job', 'Equipment', 'Application', 'Rental'],
  endpoints: () => ({}),
});