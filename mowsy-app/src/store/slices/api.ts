import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../../constants/config';
import { RootState } from '../index';

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    console.log('API baseQuery - token:', token ? 'present' : 'missing');
    console.log('API baseQuery - token value:', token);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
      console.log('API baseQuery - Authorization header set');
    } else {
      console.log('API baseQuery - No token, skipping Authorization header');
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