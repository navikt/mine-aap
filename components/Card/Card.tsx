import * as styles from './Card.module.css';

export const Card = ({
  subtleBlue,
  children,
}: {
  subtleBlue?: boolean;
  children: React.ReactNode;
}) => {
  return <div className={`${styles.card} ${subtleBlue && styles.subtleBlue}`}>{children}</div>;
};
