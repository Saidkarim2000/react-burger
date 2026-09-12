import { Button, ConstructorElement } from '@krgaa/react-developer-burger-ui-components';
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

  function handleOrderDetails(): void {
    setShowOrderDetails(!showOrderDetails);
  }

  function handleOrderDetailsClose(): void {
    setShowOrderDetails(false);
  }

  return (
    <section className={styles.burger_constructor}>
      <div className="custom-scroll">
        <ul>
          {ingredients.map((ingredient) => (
            <li key={ingredient._id} className={styles.burger_constructor_list}>
              <ConstructorElement
                isLocked={true}
                price={ingredient.price}
                text={ingredient.name}
                thumbnail={ingredient.image}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.orderBtnDiv}>
        <Button
          type="primary"
          size="large"
          onClick={handleOrderDetails}
          htmlType={'button'}
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
