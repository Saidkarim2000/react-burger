import { burgerIngredientsApi, useLogoutMutation } from '@/utils/api/api';
import { useDispatch } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';

import styles from './profile.module.css';

export default function ProfileLayout(): React.JSX.Element {
  const dispatch = useDispatch();
  const [logout, { isLoading, isError }] = useLogoutMutation();
  async function handleLogout(): Promise<void> {
    if (isLoading) {
      return;
    }

    try {
      const response = await logout().unwrap();

      if (response.success) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        dispatch(burgerIngredientsApi.util.resetApiState());
      }
    } catch {
      // isError.
    }
  }
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
          {isError && (
            <p
              role="alert"
              className="text text_type_main-default text_color_inactive mt-4"
            >
              Не удалось выйти из аккаунта. Попробуйте снова.
            </p>
          )}
          <button
            type="button"
            className={`${styles.menuItem} text text_type_main-medium`}
            onClick={() => {
              void handleLogout();
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Выход...' : 'Выход'}
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
