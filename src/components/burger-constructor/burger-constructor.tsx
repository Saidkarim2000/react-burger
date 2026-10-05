import { useCreateOrderMutation } from '@/utils/api/api';
import {
  addIngredient,
  removeIngredient,
  moveIngredient,
} from '@/utils/constructorSlice';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { selectBurgerTotalPrice } from '@utils/selectors';

import Modal from '../modal/modal';
import OrderDetails from '../order-details/order-details';

import type { RootState } from '@/utils/api/store';
import type { TConstructorIngredient } from '@/utils/constructorSlice';
import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TConstructorDragItem = {
  uuid: string;
};

type TMoveIngredientPayload = {
  uuid: string;
  toIndex: number;
};

type TDropTargetProps = {
  children: React.ReactNode;
  index: number;
  onDropHandler: (payload: TMoveIngredientPayload) => void;
};

const DropTarget = ({
  children,
  index,
  onDropHandler,
}: TDropTargetProps): React.JSX.Element => {
  const [{ isHover }, dropTarget] = useDrop<
    TConstructorDragItem,
    void,
    { isHover: boolean }
  >(
    () => ({
      accept: 'constructorIngredient',

      drop(item): void {
        onDropHandler({
          uuid: item.uuid,
          toIndex: index,
        });
      },

      collect: (monitor): { isHover: boolean } => ({
        isHover: monitor.isOver(),
      }),
    }),
    [index, onDropHandler]
  );

  return (
    <li
      ref={(node) => {
        dropTarget(node);
      }}
      className={isHover ? styles.ingredient_item_hover : styles.ingredient_item}
    >
      {children}
    </li>
  );
};

type TDraggableConstcItemProps = {
  ingredient: TConstructorIngredient;
};

const DraggableConstcItem = ({
  ingredient,
}: TDraggableConstcItemProps): React.JSX.Element => {
  const dispatch = useDispatch();

  const [, dragRef] = useDrag<TConstructorDragItem>(
    () => ({
      type: 'constructorIngredient',
      item: {
        uuid: ingredient.uuid,
      },
    }),
    [ingredient.uuid]
  );

  return (
    <div
      ref={(node) => {
        dragRef(node);
      }}
      className={styles.ingredient_item}
    >
      <DragIcon type="primary" />

      <ConstructorElement
        price={ingredient.price}
        text={ingredient.name}
        thumbnail={ingredient.image}
        handleClose={() => {
          dispatch(removeIngredient(ingredient.uuid));
        }}
      />
    </div>
  );
};

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  const [, dropRef] = useDrop<TIngredient>(() => ({
    accept: 'ingredient',
    drop: (ingredient): void => {
      dispatch(addIngredient(ingredient));
    },
  }));

  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [createOrder, { isLoading, isError }] = useCreateOrderMutation();
  const fillings = ingredients;
  const totalPrice = useSelector(selectBurgerTotalPrice);

  async function handleOrderDetails(): Promise<void> {
    if (!bun || isLoading) {
      return;
    }

    const ingredientIds = [
      bun._id,
      ...fillings.map((ingredient) => ingredient._id),
      bun._id,
    ];

    console.log('ingredientIds: \n', ingredientIds);

    try {
      const response = await createOrder({
        ingredients: ingredientIds,
      }).unwrap();
      console.log('response: \n', response);

      setOrderNumber(response.order.number);
    } catch (err) {
      console.error('Ошибка при создании заказа: ', err);
    }
  }

  function handleOrderDetailsClose(): void {
    setOrderNumber(null);
  }
  function handleMoveIngredient({ uuid, toIndex }: TMoveIngredientPayload): void {
    const fromIndex = ingredients.findIndex((ingredient) => ingredient.uuid === uuid);

    if (
      fromIndex === -1 ||
      fromIndex === toIndex ||
      toIndex < 0 ||
      toIndex >= ingredients.length
    ) {
      return;
    }

    dispatch(
      moveIngredient({
        fromIndex,
        toIndex,
      })
    );
  }

  return (
    <section
      ref={(node) => {
        dropRef(node);
      }}
      className={styles.burger_constructor}
    >
      {bun ? (
        <div className={styles.fixed_element}>
          <ConstructorElement
            type="top"
            isLocked
            price={bun.price}
            text={`${bun.name} (верх)`}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div className={`${styles.fixed_element} ${styles.placeholder_bun_top}`}>
          Выберите булки
        </div>
      )}

      <ul className={`${styles.ingredients_list} custom-scroll`}>
        {fillings.length === 0 && (
          <li className={styles.placeholder_filling}>Выберите начинку</li>
        )}

        {fillings.map((ingredient, index) => (
          <DropTarget
            key={ingredient.uuid}
            index={index}
            onDropHandler={handleMoveIngredient}
          >
            <DraggableConstcItem ingredient={ingredient} />
          </DropTarget>
        ))}
      </ul>

      {bun ? (
        <div className={styles.fixed_element}>
          <ConstructorElement
            type="bottom"
            isLocked
            price={bun.price}
            text={`${bun.name} (низ)`}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div className={`${styles.fixed_element} ${styles.placeholder_bun_bottom}`}>
          Выберите булки
        </div>
      )}

      <div className={styles.order}>
        <div className={styles.total}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>

        {isError && (
          <p className="text text_type_main_default">
            Во время оформления заказа произошла ошибка. Попробуйте еще раз.
          </p>
        )}
        <Button
          type="primary"
          size="large"
          onClick={() => void handleOrderDetails()}
          htmlType="button"
          disabled={!bun || isLoading}
        >
          {isLoading ? 'В процессе...' : 'Оформить заказ'}
        </Button>
      </div>

      {orderNumber !== null && (
        <Modal header="Детали заказа" onClose={handleOrderDetailsClose}>
          <OrderDetails
            id={String(orderNumber)}
            text="Ваш заказ начали готовить"
            note="Дождитесь готовности на орбитальной станции"
          />
        </Modal>
      )}
    </section>
  );
};
