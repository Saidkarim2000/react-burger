import { AppHeader } from '@/components/app-header/app-header';
import { Outlet } from 'react-router-dom';

import styles from './layout.module.css';

export default function Layout(): React.JSX.Element {
  return (
    <div className={styles.app}>
      <AppHeader />
      <Outlet />
    </div>
  );
}
