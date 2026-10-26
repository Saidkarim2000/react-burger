import { Link, Outlet } from 'react-router-dom';

import styles from './profile.module.css';

export default function ProfileLayout(): React.JSX.Element {
  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <nav className={styles.menu}>
          <Link
            to="/profile"
            className={`${styles.menuItem} text text_type_main-medium`}
          >
            Профиль
          </Link>

          <Link
            to="/profile/orders"
            className={`${styles.menuItem} text text_type_main-medium`}
          >
            История заказов
          </Link>

          <button
            type="button"
            className={`${styles.menuItem} text text_type_main-medium`}
          >
            Выход
          </button>
        </nav>

        <p
          className={`${styles.description} text text_type_main-default text_color_inactive`}
        >
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </aside>

      <div className={styles.content}>
        <Outlet />
      </div>
    </main>
  );
}
