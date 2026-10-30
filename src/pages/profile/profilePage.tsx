import { useUpdateUserMutation } from '@/utils/api/api';
import { selectUser } from '@/utils/userSlice';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import styles from './profile.module.css';

export default function ProfilePage(): React.JSX.Element {
  const user = useSelector(selectUser);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');

  const [updateUser, { isLoading, isError, reset }] = useUpdateUserMutation();

  const isChanged =
    name !== (user?.name ?? '') || email !== (user?.email ?? '') || password !== '';

  function handleCancel(): void {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
    reset();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!user || !isChanged || isLoading) {
      return;
    }

    try {
      const updatedUser = await updateUser({
        name,
        email,
        password,
      }).unwrap();

      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setPassword('');
    } catch {
      // isError
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <Input
        type="text"
        name="name"
        placeholder="Имя"
        icon="EditIcon"
        value={name}
        disabled={isLoading}
        onChange={(event) => {
          setName(event.target.value);
        }}
      />

      <Input
        type="email"
        name="email"
        placeholder="Логин"
        icon="EditIcon"
        value={email}
        disabled={isLoading}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />

      <Input
        type="password"
        name="password"
        placeholder="Пароль"
        icon="EditIcon"
        value={password}
        disabled={isLoading}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      {isError && (
        <p role="alert" className="text text_type_main-default text_color_inactive">
          Не удалось сохранить изменения. Проверьте данные и попробуйте снова.
        </p>
      )}

      {isChanged && (
        <div className={styles.actions}>
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Отмена
          </Button>

          <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      )}
    </form>
  );
}
