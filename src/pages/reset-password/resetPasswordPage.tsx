import { useResetPasswordMutation } from '@/utils/api/api';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import styles from '../styles/auth-form.module.css';

export default function ResetPasswordPage(): React.JSX.Element {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const [resetPassword, { isLoading, isError }] = useResetPasswordMutation();

  const navigate = useNavigate();

  const isResetAllowed = localStorage.getItem('passwordResetAllowed') === 'true';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    try {
      const response = await resetPassword({
        password,
        token,
      }).unwrap();

      if (response.success) {
        localStorage.removeItem('passwordResetAllowed');
        void navigate('/login', { replace: true });
      }
    } catch {
      // Ошибка отображается через isError.
    }
  }

  if (!isResetAllowed) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <main className={styles.page}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          void handleSubmit(event);
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

        {isError && (
          <p role="alert" className="text text_type_main-default text_color_inactive">
            Не удалось изменить пароль. Проверьте код из письма и попробуйте снова.
          </p>
        )}

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Сохранить'}
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
