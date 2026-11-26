import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import type { TIngredient, TOrder } from '@/utils/types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  order: TOrder;
  ingredientsById: ReadonlyMap<string, TIngredient>;
};

const MAX_VISIBLE_INGREDIENTS = 6;

export default function OrderCard({
  order,
  ingredientsById,
}: TOrderCardProps): React.JSX.Element | null {
  const ingredients: TIngredient[] = [];

  for (const id of order.ingredients) {
    const ingredient = ingredientsById.get(id);

    if (!ingredient) {
      return null;
    }

    ingredients.push(ingredient);
  }

  if (ingredients.length === 0) {
    return null;
  }

  const totalPrice = ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0);

  const visibleIngredients = ingredients.slice(0, MAX_VISIBLE_INGREDIENTS);
  const hiddenCount = ingredients.length - visibleIngredients.length;

  return (
    <Link to={String(order.number)} state={{ fromList: true }} className={styles.card}>
      <div className={styles.row}>
        <span className="text text_type_digits-default">
          #{String(order.number).padStart(6, '0')}
        </span>

        <FormattedDate
          date={new Date(order.createdAt)}
          className="text text_type_main-default text_color_inactive"
        />
      </div>

      <h2 className="text text_type_main-medium">{order.name ?? 'Бургер'}</h2>

      <div className={styles.row}>
        <div className={styles.ingredients}>
          {visibleIngredients.map((ingredient, index) => (
            <div
              key={index}
              className={styles.thumbnail}
              style={{ zIndex: visibleIngredients.length - index }}
            >
              <img src={ingredient.image} alt={ingredient.name} />

              {index === MAX_VISIBLE_INGREDIENTS - 1 && hiddenCount > 0 && (
                <span className={`${styles.more} text text_type_main-default`}>
                  +{hiddenCount}
                </span>
              )}
            </div>
          ))}
        </div>

        <span className={`${styles.price} text text_type_digits-default`}>
          {totalPrice}
          <CurrencyIcon type="primary" />
        </span>
      </div>
    </Link>
  );
}
