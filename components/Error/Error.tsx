import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { Cat } from 'components/Cat';
import styles from './Error.module.css';

export const Error = () => {
  return (
    <div className={styles.flexContainer}>
      <div className={styles.errorContainer}>
        <Heading level="1" size="xlarge" spacing>
          Oi, du fant meg!
        </Heading>

        <div className={styles.catContainer}>
          <div className={styles.cat}>
            <Cat />
          </div>
        </div>
        <div className={styles.containerToHideCat}>
          <div className={styles.textBox}>
            <BodyShort spacing>
              Det kan være at siden er slettet, eller at det er en feil i lenken du fulgte for å
              komme hit.
            </BodyShort>
            <Button variant="primary" onClick={() => (window.location.href = '/aap/mine-aap')}>
              Gå tilbake til Mine AAP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
