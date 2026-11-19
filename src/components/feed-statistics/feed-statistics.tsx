import type { TOrder, TOrderFeed } from '@/utils/types';

import styles from './feed-statistics.module.css';

type TFeedStatisticsProps = {
  orders: TOrder[];
  total: TOrderFeed['total'];
  totalToday: TOrderFeed['totalToday'];
};

type TStatusGroupProps = {
  title: string;
  status: 'done' | 'pending';
  orders: TOrder[];
};

function StatusGroup({ title, status, orders }: TStatusGroupProps): React.JSX.Element {
  const visibleOrders = orders.filter((order) => order.status === status).slice(0, 20);

  return (
    <section>
      <h3 className="text text_type_main-medium mb-5">{title}</h3>

      <ul className={styles.numbers}>
        {visibleOrders.map((order) => (
          <li
            key={order._id}
            className={`text text_type_digits-default ${
              status === 'done' ? styles.done : ''
            }`}
          >
            {String(order.number).padStart(6, '0')}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function FeedStatistics({
  orders,
  total,
  totalToday,
}: TFeedStatisticsProps): React.JSX.Element {
  return (
    <section className={styles.statistics} aria-label="Статистика заказов">
      <div className={styles.groups}>
        <StatusGroup title="Готово:" status="done" orders={orders} />
        <StatusGroup title="В работе:" status="pending" orders={orders} />
      </div>

      <div>
        <h2 className="text text_type_main-medium">Выполнено за всё время:</h2>
        <p className={`${styles.counter} text text_type_digits-large`}>
          {total.toLocaleString('ru-RU')}
        </p>
      </div>

      <div>
        <h2 className="text text_type_main-medium">Выполнено за сегодня:</h2>
        <p className={`${styles.counter} text text_type_digits-large`}>
          {totalToday.toLocaleString('ru-RU')}
        </p>
      </div>
    </section>
  );
}
