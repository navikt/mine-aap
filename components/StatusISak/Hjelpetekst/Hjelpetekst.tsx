import { BodyLong, Heading } from '@navikt/ds-react';
import styles from './Hjelpetekst.module.css';

//TODO: Slette komponent og flytte innholdet inn i tidslinjen
export const Hjelpetekst = () => {
  return (
    <article className={styles.container}>
      <Heading level="2" size="medium" spacing>
        Hva skjer nå?
      </Heading>
      <BodyLong size="medium">
        Vi sjekker om vi har nok helseopplysninger. Hvis vi trenger flere helseopplysninger spør vi legen din om å sende
        en legeerklæring. Du behøver ikke å gjøre noe.
      </BodyLong>
    </article>
  );
};
