import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API } from './client';

import type { TIngredient } from '../types';

type TIngredientsResponse = {
  data: TIngredient[];
};

export const burgerIngredientsApi = createApi({
  reducerPath: 'burgerIngredientsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API.url,
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredient[], void>({
      query: () => ({
        url: '/ingredients',
      }),
      transformResponse: (response: TIngredientsResponse) => response.data,
    }),
  }),
});

export const { useGetIngredientsQuery } = burgerIngredientsApi;
