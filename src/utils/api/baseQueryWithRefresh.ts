import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API } from './client';
import { refreshToken } from './refreshToken';

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

const protectedEndpoints = ['createOrder', 'getUser', 'updateUser'];

const baseQuery = fetchBaseQuery({
  baseUrl: API.url,

  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      headers.set('authorization', accessToken);
    }

    return headers;
  },
});

export const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  const isProtected = protectedEndpoints.includes(api.endpoint);
  const isAuthError = result.error?.status === 401 || result.error?.status === 403;

  if (!isProtected || !isAuthError) {
    return result;
  }

  const refreshed = await refreshToken();

  if (!refreshed.ok) {
    return refreshed.error ? { error: refreshed.error } : result;
  }

  return baseQuery(args, api, extraOptions);
};
