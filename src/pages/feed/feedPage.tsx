import FeedStatistics from '@/components/feed-statistics/feed-statistics';
import OrderCard from '@/components/order-card/order-card';
import { useGetIngredientsQuery } from '@/utils/api/api';
import { useGetPublicFeedQuery } from '@/utils/api/ordersApi';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import styles from './feedPage.module.css';

export default function FeedPage(): React.JSX.Element {
  const { data: ingredients, isError: isIngredientsError } = useGetIngredientsQuery();

  const { data: feedState } = useGetPublicFeedQuery();

  const ingredientsById = useMemo(
    () => new Map(ingredients?.map((ingredient) => [ingredient._id, ingredient])),
    [ingredients]
  );

  if (isIngredientsError) {
    return <p role="alert">Не удалось загрузить ингредиенты.</p>;
  }

  const feed = feedState?.feed;

  if (!feed && feedState?.error) {
    return <p role="alert">{feedState.error}</p>;
  }

  if (!ingredients || !feed) {
    return <Preloader />;
  }

  const visibleOrders = feed.orders.filter((order) =>
    order.ingredients.every((id) => ingredientsById.has(id))
  );

  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large mb-5">Лента заказов</h1>

      {feedState?.error && (
        <p role="alert" className="text text_type_main-default mb-4">
          {feedState.error}
        </p>
      )}

      <div className={styles.columns}>
        <section
          aria-label="Список заказов"
          className={`${styles.orders} custom-scroll`}
        >
          {visibleOrders.length === 0 && (
            <p className="text text_type_main-default">
              Пока нет заказов для отображения.
            </p>
          )}

          {visibleOrders.map((order) => (
            <OrderCard key={order._id} order={order} ingredientsById={ingredientsById} />
          ))}
        </section>

        <FeedStatistics
          orders={visibleOrders}
          total={feed.total}
          totalToday={feed.totalToday}
        />
      </div>
    </main>
  );
}
