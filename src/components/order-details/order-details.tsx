import type { TIngredient } from '@/utils/types';

import styles from './order-details.module.css';

type OrderDetailsProps = {
  props: TIngredient;
};

function OrderDetails({ props }: OrderDetailsProps): React.JSX.Element {
  const { image_large, name, calories, proteins, fat, carbohydrates } = props;

  return (
    <div>
      <div className={styles.main}>
        <img src={image_large} alt={name} />
        <h2>{name}</h2>
      </div>
      <div className={styles.info}>
        <p
          className={`${styles.infoItem} text text_type_main-default text_color_inactive`}
        >
          Калории, ккал <span>{calories}</span>
        </p>
        <p
          className={`${styles.infoItem} text text_type_main-default text_color_inactive`}
        >
          Белки, г <span>{proteins}</span>
        </p>
        <p
          className={`${styles.infoItem} text text_type_main-default text_color_inactive`}
        >
          Жиры, г <span>{fat}</span>
        </p>
        <p
          className={`${styles.infoItem} text text_type_main-default text_color_inactive`}
        >
          Углеводы, г <span>{carbohydrates}</span>
        </p>
      </div>
    </div>
  );
}

export default OrderDetails;
