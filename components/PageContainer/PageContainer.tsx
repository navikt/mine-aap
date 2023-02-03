import * as styles from './PageContainer.module.css';

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <main className={styles.mainContainer}>{children}</main>;
};
