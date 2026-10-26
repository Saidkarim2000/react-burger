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

type TUser = {
  email: string;
  name: string;
};

type TRegisterRequest = {
  email: string;
  password: string;
  name: string;
};

type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
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
    register: builder.mutation<TAuthResponse, TRegisterRequest>({
      query: (formData) => ({
        url: '/auth/register',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useGetIngredientsQuery, useCreateOrderMutation, useRegisterMutation } =
  burgerIngredientsApi;
