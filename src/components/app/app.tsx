import { useGetIngredientsQuery } from '@/utils/api/api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const { data: ingredients = [], isLoading, isError } = useGetIngredientsQuery();

  if (isLoading) {
    return <Preloader />;
  }

  if (isError) {
    return <div>Ошибка при получении данных </div>;
  }

  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients ingredients={ingredients} />
          <BurgerConstructor ingredients={ingredients} />
        </main>
      </div>
    </>
  );
};

export default App;
