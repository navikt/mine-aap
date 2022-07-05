import { AppHeader } from '../AppHeader/AppHeader';
import styles from './Layout.module.css';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout}>
      <AppHeader />
      <main>{children}</main>
    </div>
  );
};
