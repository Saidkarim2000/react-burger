import { combineSlices, configureStore as createStore } from '@reduxjs/toolkit';

import burgerConstructorSlice from '../constructorSlice';
import ingredientsSlice from '../ingredientsSlice';
import userSlice from '../userSlice';
import { burgerIngredientsApi } from './api';

const rootReducer = combineSlices(
  burgerIngredientsApi,
  ingredientsSlice,
  burgerConstructorSlice,
  userSlice
);

export const store = createStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(burgerIngredientsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
