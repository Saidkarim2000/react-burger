import { Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import styles from './profile.module.css';

export default function ProfilePage(): React.JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Input
        type="text"
        name="name"
        placeholder="Имя"
        icon="EditIcon"
        value={name}
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
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
    </form>
  );
}
