import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from '../styles/auth-form.module.css';

export default function ResetPasswordPage(): React.JSX.Element {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  return (
    <main className={styles.page}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>

        <PasswordInput
          name="password"
          placeholder="Введите новый пароль"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        <Input
          type="text"
          name="token"
          placeholder="Введите код из письма"
          value={token}
          onChange={(event) => {
            setToken(event.target.value);
          }}
        />

        <Button htmlType="submit" type="primary" size="medium">
          Сохранить
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
