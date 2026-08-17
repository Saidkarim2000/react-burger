import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  console.log(ingredients);

  return (
    <section className={styles.burger_constructor}>
      <div className="custom-scroll">
        <ol>
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
        </ol>
      </div>
    </section>
  );
};
