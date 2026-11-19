import OrderCard from '@/components/order-card/order-card';
import { useGetIngredientsQuery } from '@/utils/api/api';
import { useGetPublicFeedQuery } from '@/utils/api/ordersApi';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

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

  return (
    <main className="pl-5 pr-5">
      <h1 className="text text_type_main-large mt-10 mb-5">Лента заказов</h1>

      {feedState?.error && <p role="alert">{feedState.error}</p>}

      {feed.orders.length === 0 && (
        <p className="text text_type_main-default">Заказов пока нет.</p>
      )}

      {feed.orders.map((order) => (
        <div key={order._id} className="mb-4">
          <OrderCard order={order} ingredientsById={ingredientsById} />
        </div>
      ))}
    </main>
  );
}
