import { useLoginMutation } from '@/utils/api/api';
import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from '../styles/auth-form.module.css';

export default function LoginPage(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isLoading, isError, isSuccess }] = useLoginMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    try {
      const response = await login({
        email,
        password,
      }).unwrap();

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    } catch {
      // isError
    }
  }

  return (
    <main className={styles.page}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <h1 className="text text_type_main-medium">Вход</h1>

        <EmailInput
          name="email"
          placeholder="E-mail"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        <PasswordInput
          name="password"
          placeholder="Пароль"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        {isError && (
          <p role="alert" className="text text_type_main-default text_color_inactive">
            Не удалось войти. Проверьте e-mail, пароль и подключение к сети.
          </p>
        )}

        {isSuccess && (
          <p className="text text_type_main-default">Вход выполнен успешно.</p>
        )}

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </form>

      <div className={styles.links}>
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?{' '}
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </p>

        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link to="/forgot-password" className={styles.link}>
            Восстановить пароль
          </Link>
        </p>
      </div>
    </main>
  );
}
