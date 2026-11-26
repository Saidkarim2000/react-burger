import Modal from '@/components/modal/modal';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function FeedOrderModal(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
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
    <Modal header={`Заказ #${id}`} onClose={handleClose}>
      <p className="text text_type_main-default">Состав заказа</p>
    </Modal>
  );
}
