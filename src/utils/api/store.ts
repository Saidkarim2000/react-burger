import { combineSlices, configureStore as createStore } from '@reduxjs/toolkit';

import ingredientsSlice from '../ingredientsSlice';
import { burgerIngredientsApi } from './api';

const rootReducer = combineSlices(burgerIngredientsApi, ingredientsSlice);

export const configureStore = (): ReturnType<typeof createStore> => {
  return createStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(burgerIngredientsApi.middleware);
    },
  });
};

export type RootState = ReturnType<typeof rootReducer>;
