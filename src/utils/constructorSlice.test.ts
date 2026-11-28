import { describe, expect, it } from 'vitest';

import burgerConstructorSlice from './constructorSlice';

import type { TIngredient } from './types';

const { reducer, actions } = burgerConstructorSlice;
const { addIngredient, removeIngredient, moveIngredient, clearOrderedIngredients } =
  actions;

const filling: TIngredient = {
  _id: 'filling-id',
  name: 'Котлета',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 2,
  calories: 93,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: '',
  __v: 0,
};

const bun: TIngredient = {
  ...filling,
  _id: 'bun-id',
  name: 'Булка',
  type: 'bun',
};

const firstFilling = { ...filling, uuid: 'filling-1' };
const secondFilling = { ...filling, uuid: 'filling-2' };
const selectedBun = { ...bun, uuid: 'bun-1' };

describe('Редьюсер конструктора бургера', () => {
  it('возвращает пустой конструктор при инициализации', () => {
    const state = burgerConstructorSlice.reducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });
  it('заменяет выбранную булку и сохраняет начинки', () => {
    const startState = { bun: selectedBun, ingredients: [firstFilling] };
    const newBun = { ...bun, _id: 'another-bun-id', name: 'Другая булка' };
    const action = addIngredient(newBun);

    const result = reducer(startState, action);

    expect(result).toEqual({
      bun: action.payload,
      ingredients: [firstFilling],
    });
  });

  it('добавляет две порции одной начинки с разными uuid', () => {
    const startState = { bun: selectedBun, ingredients: [] };
    const firstAction = addIngredient(filling);
    const secondAction = addIngredient(filling);

    const afterFirst = reducer(startState, firstAction);
    const result = reducer(afterFirst, secondAction);

    const firstUuid = firstAction.payload.uuid;
    const secondUuid = secondAction.payload.uuid;

    expect(firstUuid).toBeTypeOf('string');
    expect(secondUuid).toBeTypeOf('string');
    expect(firstUuid).not.toBe(secondUuid);

    expect(result).toEqual({
      bun: selectedBun,
      ingredients: [
        { ...filling, uuid: firstUuid },
        { ...filling, uuid: secondUuid },
      ],
    });
  });

  it('удаляет по uuid только выбранную порцию начинки', () => {
    const startState = {
      bun: selectedBun,
      ingredients: [firstFilling, secondFilling],
    };

    const result = reducer(startState, removeIngredient(firstFilling.uuid));

    expect(result).toEqual({
      bun: selectedBun,
      ingredients: [secondFilling],
    });
  });

  it('перемещает начинку на указанную позицию', () => {
    const startState = {
      bun: selectedBun,
      ingredients: [firstFilling, secondFilling],
    };

    const result = reducer(startState, moveIngredient({ fromIndex: 0, toIndex: 1 }));

    expect(result).toEqual({
      bun: selectedBun,
      ingredients: [secondFilling, firstFilling],
    });
  });

  it.each([
    [-1, 0],
    [2, 0],
    [0, -1],
    [0, 2],
    [1, 1],
  ])('сохраняет порядок при перемещении с %i на %i', (fromIndex, toIndex) => {
    const startState = {
      bun: selectedBun,
      ingredients: [firstFilling, secondFilling],
    };

    const result = reducer(startState, moveIngredient({ fromIndex, toIndex }));

    expect(result).toEqual(startState);
  });

  it('убирает булку и начинки после оформления заказа', () => {
    const startState = {
      bun: selectedBun,
      ingredients: [firstFilling, secondFilling],
    };

    const result = reducer(
      startState,
      clearOrderedIngredients({
        bunUuid: selectedBun.uuid,
        ingredientUuids: [firstFilling.uuid, secondFilling.uuid],
      })
    );

    expect(result).toEqual({ bun: null, ingredients: [] });
  });

  it('сохраняет булку и начинку, добавленные во время оформления заказа', () => {
    const newBun = { ...bun, uuid: 'bun-2' };
    const currentState = {
      bun: newBun,
      ingredients: [firstFilling, secondFilling],
    };

    const result = reducer(
      currentState,
      clearOrderedIngredients({
        bunUuid: selectedBun.uuid,
        ingredientUuids: [firstFilling.uuid],
      })
    );

    expect(result).toEqual({
      bun: newBun,
      ingredients: [secondFilling],
    });
  });
});
