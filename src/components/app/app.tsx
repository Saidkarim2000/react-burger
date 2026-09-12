import { API } from '@/utils/api/client';
import { Button, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import Modal from '../modal/modal';
import OrderDetails from '../order-details/order-details';

import type { TIngredient } from '@/utils/types';

import styles from './app.module.css';

type TIngredientsResponse = {
  data: TIngredient[];
};

export const App = (): React.JSX.Element => {
  const [result, setResult] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  function handleOrderDetails(): void {
    setShowOrderDetails(!showOrderDetails);
  }

  function handleOrderDetailsClose(): void {
    setShowOrderDetails(false);
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(API.url, {
      signal,
    })
      .then((resp) => resp.json() as Promise<TIngredientsResponse>)
      .then((resp) => setResult(resp.data))
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return (): void => {
      controller.abort();
    };
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients ingredients={result} />
          <BurgerConstructor ingredients={result} />
        </main>
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
    </>
  );
};

export default App;
