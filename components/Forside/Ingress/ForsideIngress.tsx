import styles from './ForsideIngress.module.css';
import { BodyLong } from '@navikt/ds-react';

export const ForsideIngress = ({ children }: { children: React.ReactNode }) => (
  <BodyLong size={'large'} className={styles.ingress}>
    {children}
  </BodyLong>
);
