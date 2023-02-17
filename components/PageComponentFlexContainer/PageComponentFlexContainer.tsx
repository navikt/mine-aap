import * as styles from './PageComponentFlexContainer.module.css';

export const PageComponentFlexContainer = ({
  subtleBackground,
  children,
}: {
  subtleBackground?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className={`${styles.flexContainer} ${subtleBackground && styles.subtleBackground}`}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
