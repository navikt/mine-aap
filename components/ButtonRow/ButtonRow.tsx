import * as styles from './ButtonRow.module.css';

export const ButtonRow = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.row}>{children}</div>;
};
