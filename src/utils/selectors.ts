import { createSelector } from '@reduxjs/toolkit';

import { burgerIngredientsApi } from './api/api';

import type { RootState } from './api/store';
import type { TBurgerConstructorState } from './constructorSlice';

const selectIngredientsQuery = burgerIngredientsApi.endpoints.getIngredients.select();

export const selectIngredients = createSelector(
  [selectIngredientsQuery],
  (ingredientsQuery) => ingredientsQuery.data ?? []
);

const selectBurgerConstructor = (state: RootState): TBurgerConstructorState =>
  state.burgerConstructor;

export const selectIngredientCounts = createSelector(
  [selectBurgerConstructor],
  ({ bun, ingredients }): Record<string, number> => {
    const counts: Record<string, number> = {};

    for (const ingredient of ingredients) {
      counts[ingredient._id] = (counts[ingredient._id] ?? 0) + 1;
    }

    if (bun) {
      counts[bun._id] = (counts[bun._id] ?? 0) + 2;
    }

    return counts;
  }
);

export const selectBurgerTotalPrice = createSelector(
  [selectBurgerConstructor],
  ({ bun, ingredients }): number => {
    const bunPrice = bun ? bun.price * 2 : 0;

    return ingredients.reduce((total, ingredient) => total + ingredient.price, bunPrice);
  }
);
