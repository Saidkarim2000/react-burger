import { useRegisterMutation } from '@/utils/api/api';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type React from 'react';

import styles from '../styles/auth-form.module.css';

export default function RegisterPage(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [register, { isLoading, isError, isSuccess }] = useRegisterMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    try {
      await register({ name, email, password }).unwrap();
    } catch {
      // isError.
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
        <h1 className="text text_type_main-medium">Регистарция</h1>

        <Input
          type="text"
          name="name"
          placeholder="Имя"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />

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
            Не удалось зарегистрироваться. Проверьте данные и попробуйте снова.
          </p>
        )}

        {isSuccess && (
          <p className="text text_type_main-default">Регистрация прошла успешно.</p>
        )}

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>

      <div className={styles.links}>
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
}
