import { Heading } from '@navikt/ds-react';
import styles from './AppHeader.module.css';

export const AppHeader = () => (
  <header className={styles.appHeader}>
    <Heading level="1" size="xlarge">
      Dine arbeidsavklaringspenger
    </Heading>
  </header>
);
