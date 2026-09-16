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

  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const bun = ingredients.find((ingredient) => ingredient.type === 'bun');

  const fillings = ingredients.filter((ingredient) => ingredient.type !== 'bun');

  const totalPrice =
    fillings.reduce((sum, ingredient) => sum + ingredient.price, 0) +
    (bun ? bun.price * 2 : 0);

  function handleOrderDetails(): void {
    setShowOrderDetails(!showOrderDetails);
  }

  function handleOrderDetailsClose(): void {
    setShowOrderDetails(false);
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

        <Button
          type="primary"
          size="large"
          onClick={handleOrderDetails}
          htmlType="button"
        >
          Оформить заказ
        </Button>
      </div>

      {showOrderDetails && (
        <Modal header="Детали заказа" onClose={handleOrderDetailsClose}>
          <OrderDetails
            id="034536"
            text="Ваш заказ начали готовить"
            note="Дождитесь готовности на орбитальной станции"
          />
        </Modal>
      )}
    </section>
  );
};
