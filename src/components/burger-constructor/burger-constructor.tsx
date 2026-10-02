import { useCreateOrderMutation } from '@/utils/api/api';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import Modal from '../modal/modal';
import OrderDetails from '../order-details/order-details';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  console.log(ingredients);

  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [createOrder, { isLoading, isError }] = useCreateOrderMutation();
  const bun = ingredients.find((ingredient) => ingredient.type === 'bun');

  const fillings = ingredients.filter((ingredient) => ingredient.type !== 'bun');

  const totalPrice =
    fillings.reduce((sum, ingredient) => sum + ingredient.price, 0) +
    (bun ? bun.price * 2 : 0);

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

  return (
    <section className={styles.burger_constructor}>
      {bun && (
        <div className={styles.fixed_element}>
          <ConstructorElement
            type="top"
            isLocked
            price={bun.price}
            text={`${bun.name} (верх)`}
            thumbnail={bun.image}
          />
        </div>
      )}

      <ul className={`${styles.ingredients_list} custom-scroll`}>
        {fillings.map((ingredient, index) => (
          <li key={`${ingredient._id}-${index}`} className={styles.ingredient_item}>
            <DragIcon type="primary" />

            <ConstructorElement
              price={ingredient.price}
              text={ingredient.name}
              thumbnail={ingredient.image}
              handleClose={() => {
                console.log('Удалить:', ingredient.name);
              }}
            />
          </li>
        ))}
      </ul>

      {bun && (
        <div className={styles.fixed_element}>
          <ConstructorElement
            type="bottom"
            isLocked
            price={bun.price}
            text={`${bun.name} (низ)`}
            thumbnail={bun.image}
          />
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
