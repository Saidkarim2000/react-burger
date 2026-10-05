import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API } from './client';

import type { TIngredient } from '../types';

type TIngredientsResponse = {
  data: TIngredient[];
};

type TCreateOrderRequest = {
  ingredients: string[];
};

type TCreateOrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
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
    createOrder: builder.mutation<TCreateOrderResponse, TCreateOrderRequest>({
      query: (ingredients) => ({
        url: '/orders',
        method: 'POST',
        body: ingredients,
      }),
    }),
  }),
});

export const { useGetIngredientsQuery, useCreateOrderMutation } = burgerIngredientsApi;
