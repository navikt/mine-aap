import { BodyLong } from '@navikt/ds-react';
import styles from './ForsideIngress.module.css';

export const ForsideIngress = ({ children }: { children: React.ReactNode }) => (
  <BodyLong size={'large'} className={styles.ingress}>
    {children}
  </BodyLong>
);
