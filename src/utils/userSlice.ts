import { createSlice } from '@reduxjs/toolkit';

import { burgerIngredientsApi } from './api/api';

import type { TUser } from './api/api';
import type { PayloadAction } from '@reduxjs/toolkit';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        burgerIngredientsApi.endpoints.login.matchFulfilled,
        (state, action) => {
          state.user = action.payload;
          state.isAuthChecked = true;
        }
      )
      .addMatcher(
        burgerIngredientsApi.endpoints.register.matchFulfilled,
        (state, action) => {
          state.user = action.payload;
          state.isAuthChecked = true;
        }
      )
      .addMatcher(
        burgerIngredientsApi.endpoints.getUser.matchFulfilled,
        (state, action) => {
          state.user = action.payload;
        }
      )
      .addMatcher(
        burgerIngredientsApi.endpoints.updateUser.matchFulfilled,
        (state, action) => {
          state.user = action.payload;
        }
      )
      .addMatcher(burgerIngredientsApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser, setIsAuthChecked } = userSlice.actions;

export const { selectUser, selectIsAuthChecked } = userSlice.selectors;

export default userSlice;
