import OrderCard from '@/components/order-card/order-card';
import { useGetIngredientsQuery } from '@/utils/api/api';
import { useGetUserFeedQuery } from '@/utils/api/ordersApi';
import { useAppSelector } from '@/utils/hook';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';

import styles from './profileOrderPage.module.css';

export default function ProfileOrderPage(): React.JSX.Element {
  const user = useAppSelector((state) => state.user.user);
  const { currentData: feedState } = useGetUserFeedQuery(user?.email ?? skipToken);
  const { data: ingredients, isError: isIngredientsError } = useGetIngredientsQuery();

  const ingredientsById = useMemo(
    () => new Map(ingredients?.map((ingredient) => [ingredient._id, ingredient])),
    [ingredients]
  );

  if (feedState?.error) {
    return <p role="alert">{feedState.error}</p>;
  }

  if (isIngredientsError) {
    return <p role="alert">Не удалось загрузить ингредиенты.</p>;
  }

  if (!feedState?.feed || !ingredients) {
    return <p role="status">Загружаем историю заказов…</p>;
  }

  const visibleOrders = feedState.feed.orders
    .filter((order) => order.ingredients.every((id) => ingredientsById.has(id)))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

  return (
    <>
      {visibleOrders.length === 0 ? (
        <p className="text text_type_main-default">Пока нет заказов для отображения.</p>
      ) : (
        <section
          aria-label="История заказов"
          className={`${styles.orders} custom-scroll`}
        >
          {visibleOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              ingredientsById={ingredientsById}
              showStatus
            />
          ))}
        </section>
      )}

      <Outlet context={{ orders: feedState.feed.orders, ingredientsById }} />
    </>
  );
}
