import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API } from './client';

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

type TRefreshResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

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
  let result = await baseQuery(args, api, extraOptions);

  const isProtected = protectedEndpoints.includes(api.endpoint);

  const isAuthError = result.error?.status === 401 || result.error?.status === 403;

  if (!isProtected || !isAuthError) {
    return result;
  }

  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return result;
  }

  const refreshResult = await baseQuery(
    {
      url: '/auth/token',
      method: 'POST',
      body: {
        token: refreshToken,
      },
    },
    api,
    extraOptions
  );

  const tokens = refreshResult.data as TRefreshResponse | undefined;

  if (
    tokens?.success &&
    typeof tokens.accessToken === 'string' &&
    typeof tokens.refreshToken === 'string'
  ) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    result = await baseQuery(args, api, extraOptions);
  } else {
    if (refreshResult.error?.status === 401 || refreshResult.error?.status === 403) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    if (refreshResult.error) {
      return { error: refreshResult.error };
    }
  }

  return result;
};
