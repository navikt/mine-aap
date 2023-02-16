import { Heading, LinkPanel } from '@navikt/ds-react';
import * as styles from './NyttigÅVite.module.css';

export const NyttigÅVite = () => {
  return (
    <>
      <Heading level="2" size="medium" spacing>
        Nyttig å vite
      </Heading>
      <div className={styles.container}>
        <LinkPanel className={styles.linkPanel} href="#" border={false}>
          Forventet saksbehandlingstider
        </LinkPanel>
        <LinkPanel className={styles.linkPanel} href="#" border={false}>
          Alle dine innsendte søknader
        </LinkPanel>
      </div>
    </>
  );
};
