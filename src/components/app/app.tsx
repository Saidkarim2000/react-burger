import { API } from '@/utils/api/client';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { TIngredient } from '@/utils/types';

import styles from './app.module.css';

type TIngredientsResponse = {
  data: TIngredient[];
};

export const App = (): React.JSX.Element => {
  const [result, setResult] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients ingredients={result} />
        <BurgerConstructor ingredients={result} />
      </main>
    </div>
  );
};

export default App;
