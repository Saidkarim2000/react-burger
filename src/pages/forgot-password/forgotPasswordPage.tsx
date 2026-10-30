import { useForgotPasswordMutation } from '@/utils/api/api';
import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from '../styles/auth-form.module.css';

export default function ForgotPasswordPage(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading, isError }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  async function handleResetPassword(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    try {
      const response = await forgotPassword({ email }).unwrap();

      if (response.success) {
        localStorage.setItem('passwordResetAllowed', 'true');
        void navigate('/reset-password');
      }
    } catch {
      // isError.
    }
  }

  return (
    <main className={styles.page}>
      <form
        className={styles.form}
        onSubmit={(event) => void handleResetPassword(event)}
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
        {isError && (
          <p
            role="alert"
            className="text text_type_main-default text_color_inactive mt-4"
          >
            Не удалось восстановить пароль. Попробуйте снова.
          </p>
        )}

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Восстановление...' : 'Восстановить'}
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
