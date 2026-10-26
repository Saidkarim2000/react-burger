import { NavLink, Outlet } from 'react-router-dom';

import styles from './profile.module.css';

export default function ProfileLayout(): React.JSX.Element {
  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <nav className={styles.menu}>
          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              `${styles.menuItem} text text_type_main-medium ${
                isActive ? styles.link_active : ''
              }`
            }
          >
            Профиль
          </NavLink>

          <NavLink
            to="/profile/orders"
            className={({ isActive }) =>
              `${styles.menuItem} text text_type_main-medium ${
                isActive ? styles.link_active : ''
              }`
            }
          >
            История заказов
          </NavLink>

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
