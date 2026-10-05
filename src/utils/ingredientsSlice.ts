import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from './types';
import type { PayloadAction } from '@reduxjs/toolkit';

type TIngredientsState = {
  selectedIngredient: TIngredient | null;
};

const initialState: TIngredientsState = {
  selectedIngredient: null,
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    selectIngredient(state, action: PayloadAction<TIngredient>) {
      state.selectedIngredient = action.payload;
    },
    clearSelectedIngredient(state) {
      state.selectedIngredient = null;
    },
  },
});

export const { selectIngredient, clearSelectedIngredient } = ingredientsSlice.actions;

export default ingredientsSlice;
