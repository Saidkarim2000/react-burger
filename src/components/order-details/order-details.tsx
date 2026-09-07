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
      <h1 style={{ fontSize: '70px' }} className="text text_type_digits-default">
        {id}
      </h1>
      <p style={{ fontSize: '14px' }}>идентификатор заказа</p>
      <CheckMarkIcon className={styles.checkMarkIcon} type="secondary" />
      <small style={{ fontSize: '12px' }}>{text}</small>
      <span
        style={{ fontSize: '12px' }}
        className="text text_type_main-default text_color_inactive"
      >
        {note}
      </span>
    </div>
  );
}

export default OrderDetails;
