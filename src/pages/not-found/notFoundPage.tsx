import { Link } from 'react-router-dom';

import styles from './notFoundPage.module.css';

export default function NotFoundPage(): React.JSX.Element {
  return (
    <main className={styles.page}>
      <h1 className="text text_type_digits-large">404</h1>

      <p className="text text_type_main-medium">Страница не найдена</p>

      <Link to="/" className={`${styles.link} text text_type_main-default`}>
        Вернуться в конструктор
      </Link>
    </main>
  );
}
