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

export type TUser = {
  email: string;
  name: string;
};
type TGetUserResponse = {
  success: boolean;
  user: TUser;
};
type TUpdateUserRequest = {
  name: string;
  email: string;
  password: string;
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

type TForgotPasswordRequest = {
  email: string;
};

type TResetPasswordRequest = {
  password: string;
  token: string;
};

type TResetPasswordResponse = {
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
    register: builder.mutation<TUser, TRegisterRequest>({
      query: (formData) => ({
        url: '/auth/register',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: TAuthResponse): TUser => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        return response.user;
      },
    }),

    login: builder.mutation<TUser, TLoginRequest>({
      query: (formData) => ({
        url: '/auth/login',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: TAuthResponse): TUser => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        return response.user;
      },
    }),

    logout: builder.mutation<null, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        body: {
          token: localStorage.getItem('refreshToken'),
        },
      }),
      transformResponse: (_response: TLogoutResponse): null => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        return null;
      },
    }),
    forgotPassword: builder.mutation<TResetPasswordResponse, TForgotPasswordRequest>({
      query: (formData) => ({
        url: '/password-reset',
        method: 'POST',
        body: formData,
      }),
    }),
    resetPassword: builder.mutation<TResetPasswordResponse, TResetPasswordRequest>({
      query: (formData) => ({
        url: '/password-reset/reset',
        method: 'POST',
        body: formData,
      }),
    }),
    getUser: builder.query<TUser, void>({
      query: () => ({
        url: '/auth/user',
        method: 'GET',
      }),
      transformResponse: (response: TGetUserResponse): TUser => response.user,
    }),

    updateUser: builder.mutation<TUser, TUpdateUserRequest>({
      query: (formData) => ({
        url: '/auth/user',
        method: 'PATCH',
        body: formData,
      }),
      transformResponse: (response: TGetUserResponse): TUser => response.user,
    }),
  }),
});

export const {
  useGetIngredientsQuery,
  useCreateOrderMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLazyGetUserQuery,
  useUpdateUserMutation,
} = burgerIngredientsApi;
