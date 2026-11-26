import Modal from '@/components/modal/modal';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';

import type { TIngredient, TOrder } from '@/utils/types';

import styles from './feedOrderModal.module.css';

const statusLabels: Record<TOrder['status'], string> = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
};
type TFeedOutletContext = {
  orders: readonly TOrder[];
  ingredientsById: ReadonlyMap<string, TIngredient>;
};

type TIngredientRow = {
  ingredient: TIngredient;
  quantity: number;
};
type TOrderComposition = {
  rows: TIngredientRow[];
  totalPrice: number;
};
function getOrderComposition(
  ids: readonly string[],
  ingredientsById: ReadonlyMap<string, TIngredient>
): TOrderComposition | null {
  const rowsById = new Map<string, TIngredientRow>();
  let totalPrice = 0;

  for (const id of ids) {
    const ingredient = ingredientsById.get(id);

    if (!ingredient) {
      return null;
    }

    totalPrice += ingredient.price;

    const row = rowsById.get(id);

    if (row) {
      row.quantity += 1;
    } else {
      rowsById.set(id, { ingredient, quantity: 1 });
    }
  }

  return {
    rows: Array.from(rowsById.values()),
    totalPrice,
  };
}
export default function FeedOrderModal(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { orders, ingredientsById } = useOutletContext<TFeedOutletContext>();
  const order = orders.find((item) => String(item.number) === id);
  const composition = order
    ? getOrderComposition(order.ingredients, ingredientsById)
    : null;
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { fromList?: boolean } | null;

  function handleClose(): void {
    if (state?.fromList) {
      void navigate(-1);
      return;
    }

    void navigate('/feed', { replace: true });
  }

  return (
    <Modal
      header={
        order ? `#${String(order.number).padStart(6, '0')}` : 'Информация о заказе'
      }
      onClose={handleClose}
    >
      {order ? (
        <>
          <h2 className="text text_type_main-medium mt-8">{order.name ?? 'Бургер'}</h2>

          <p className="text text_type_main-default mt-2">
            {statusLabels[order.status]}
          </p>
          <h3 className="text text_type_main-medium mt-10 mb-4">Состав:</h3>

          {composition ? (
            <>
              <ul className={`${styles.ingredients} custom-scroll`}>
                {composition.rows.map(({ ingredient, quantity }) => (
                  <li key={ingredient._id} className={styles.row}>
                    <span className={styles.thumbnail}>
                      <img src={ingredient.image} alt="" />
                    </span>

                    <span className="text text_type_main-default">
                      {ingredient.name}
                    </span>

                    <span className={`${styles.price} text text_type_digits-default`}>
                      {quantity} × {ingredient.price}
                      <CurrencyIcon type="primary" />
                    </span>
                  </li>
                ))}
              </ul>

              <div className={`${styles.footer} mt-8`}>
                <FormattedDate
                  date={new Date(order.createdAt)}
                  className="text text_type_main-default text_color_inactive"
                />

                <span className={`${styles.price} text text_type_digits-default`}>
                  {composition.totalPrice}
                  <CurrencyIcon type="primary" />
                </span>
              </div>
            </>
          ) : (
            <p className="text text_type_main-default">Состав заказа недоступен.</p>
          )}
        </>
      ) : (
        <p className="text text_type_main-default">Заказ отсутствует в текущей ленте.</p>
      )}
    </Modal>
  );
}
