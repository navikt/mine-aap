import styles from './ForsideIngress.module.css';
import { Ingress } from '@navikt/ds-react';

export const ForsideIngress = ({ children }: { children: React.ReactNode }) => (
  <Ingress className={styles.ingress}>{children}</Ingress>
);
