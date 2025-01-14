import styles from './layout.module.css';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <main className={styles.mainContainer}>{children}</main>;
};

export default Layout;
