import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

type OrderDetailsProps = {
  id: string;
  text: string;
  note: string;
};

function OrderDetails({ id, text, note }: OrderDetailsProps): React.JSX.Element {
  return (
    <div className={styles.main}>
      <h1 className={`${styles.order_id} text text_type_digits-default`}>{id}</h1>
      <p className={styles.order_id_label}>идентификатор заказа</p>
      <CheckMarkIcon className={styles.checkMarkIcon} type="secondary" />
      <small className={styles.order_text}>{text}</small>
      <span
        className={`${styles.order_note} text text_type_main-default text_color_inactive`}
      >
        {note}
      </span>
    </div>
  );
}

export default OrderDetails;
