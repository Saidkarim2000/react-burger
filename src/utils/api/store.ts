import { combineSlices, configureStore as createStore } from '@reduxjs/toolkit';

import { burgerIngredientsApi } from './api';

const rootReducer = combineSlices(burgerIngredientsApi);

export const configureStore = (): ReturnType<typeof createStore> => {
  return createStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(burgerIngredientsApi.middleware);
    },
  });
};
