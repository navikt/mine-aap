'use client';

import { BodyLong } from '@navikt/ds-react';
import Link from 'node_modules/@navikt/ds-react/esm/link/Link';
import styles from './SøknadshjelpCard.module.css';

//TODO: avklare om vi skal lage komponent, eller om søknadshjelp nå håndteres av tidslinje

export const SøknadshjelpLinkcard = () => {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Link className={styles.link} href="/aap/mine-aap/nb/oversikt/saksoversikt/">
          Slik behandler vi søknaden
        </Link>
        <BodyLong>Sjekk hvilke steg søknaden din må gjennom.</BodyLong>
      </div>
    </section>
  );
};
