import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithRefresh } from './baseQueryWithRefresh';

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

type TLoginRequest = {
  email: string;
  password: string;
};

type TLogoutResponse = {
  success: boolean;
  message: string;
};

export const burgerIngredientsApi = createApi({
  reducerPath: 'burgerIngredientsApi',
  baseQuery: baseQueryWithRefresh,
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
    login: builder.mutation<TAuthResponse, TLoginRequest>({
      query: (formData) => ({
        url: '/auth/login',
        method: 'POST',
        body: formData,
      }),
    }),
    logout: builder.mutation<TLogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        body: {
          token: localStorage.getItem('refreshToken'),
        },
      }),
    }),
  }),
});

export const {
  useGetIngredientsQuery,
  useCreateOrderMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
} = burgerIngredientsApi;
