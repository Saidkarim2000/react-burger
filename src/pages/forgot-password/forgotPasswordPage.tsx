import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from '../styles/auth-form.module.css';

export default function ForgotPasswordPage(): React.JSX.Element {
  const [email, setEmail] = useState('');

  return (
    <main className={styles.page}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>

        <EmailInput
          name="email"
          placeholder="Укажите e-mail"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        <Button htmlType="submit" type="primary" size="medium">
          Восстановить
        </Button>
      </form>

      <div className={styles.links}>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
}
