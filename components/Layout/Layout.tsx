import { AppHeader } from 'components/AppHeader/AppHeader';
import styles from 'components/Layout/Layout.module.css';

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <AppHeader />
      <main className={styles.main}>{children}</main>
    </div>
  );
};
