import Modal from '@/components/modal/modal';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';

import type { TOrder } from '@/utils/types';

const statusLabels: Record<TOrder['status'], string> = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
};

export default function FeedOrderModal(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const orders = useOutletContext<readonly TOrder[]>();
  const order = orders.find((item) => String(item.number) === id);
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
        </>
      ) : (
        <p className="text text_type_main-default">Заказ отсутствует в текущей ленте.</p>
      )}
    </Modal>
  );
}
