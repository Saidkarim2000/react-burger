import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredient } from './types';

type TConstructorIngredient = TIngredient & {
  uuid: string;
};

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            uuid: nanoid(),
          },
        };
      },
    },
    removeIngredient(state: TBurgerConstructorState, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.uuid !== action.payload
      );
    },

    moveIngredient(
      state: TBurgerConstructorState,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;

      const [ingredient] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, ingredient);
    },
  },
});

export type { TConstructorIngredient };

export const { addIngredient, removeIngredient, moveIngredient } =
  burgerConstructorSlice.actions;

export default burgerConstructorSlice;
