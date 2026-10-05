import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './api/store';

const selectBurgerConstructor = (state: RootState): RootState['burgerConstructor'] =>
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
