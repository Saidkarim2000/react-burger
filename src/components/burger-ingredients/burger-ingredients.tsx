import { Tab, Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  console.log(ingredients);

  const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');
  const mains = ingredients.filter((ingredient) => ingredient.type === 'main');
  const sauces = ingredients.filter((ingredient) => ingredient.type === 'sauce');

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={true}
            onClick={() => {
              /* TODO */
            }}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Соусы
          </Tab>
        </ul>
      </nav>

      <main className="custom-scroll">
        <div className={styles.menu_section}>
          <header className="text text_type_main-medium">Булки</header>
          <ol className={styles.menu_section_block}>
            {buns.map((bun) => (
              <li key={bun._id}>
                <img src={bun.image} alt={bun.name} />
                <Counter count={1} size="default" extraClass="" />
                <div className={styles.menu_item_price}>
                  <h3 className="text text_type_main-default">{bun.price}</h3>
                  <CurrencyIcon type="primary" />
                </div>
                <span>{bun.name}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.menu_section}>
          <header className="text text_type_main-medium">Соусы</header>
          <ol className={styles.menu_section_block}>
            {sauces.map((sauce) => (
              <li key={sauce._id}>
                <img src={sauce.image} alt={sauce.name} />
                <Counter count={1} size="default" extraClass="" />
                <div className={styles.menu_item_price}>
                  <h3 className="text text_type_main-default">{sauce.price}</h3>
                  <CurrencyIcon type="primary" />
                </div>
                <span>{sauce.name}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.menu_section}>
          <header className="text text_type_main-medium">Начинки</header>
          <ol className={styles.menu_section_block}>
            {mains.map((main) => (
              <li key={main._id}>
                <img src={main.image} alt={main.name} />
                <Counter count={1} size="default" extraClass="" />
                <div className={styles.menu_item_price}>
                  <h3 className="text text_type_main-default">{main.price}</h3>
                  <CurrencyIcon type="primary" />
                </div>
                <span>{main.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </section>
  );
};
