import { useState, useEffect } from 'react';
import styles from './ClientRender.module.css';

export const ClientRender = ({
  placeholderHeight,
  children,
}: {
  placeholderHeight: string;
  children: React.ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <div className={styles.fadeIn}>{children}</div>
  ) : (
    <div style={{ height: placeholderHeight }}></div>
  );
};
