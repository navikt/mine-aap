'use client';

import { Heading, BodyShort } from '@navikt/ds-react';
import styles from './MeldekortlenkeNy.module.css';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Link } from 'node_modules/@navikt/ds-react/esm/link/Link';

export const MeldekortlenkeNy = () => {
  return (
    <div className={styles.wrapper}>
      <Heading size="xsmall" level="4" className={styles.heading}>
        Meldekort
      </Heading>
      <section className={styles.container}>
        <Link href="/aap/mine-aap/nb/oversikt/saksoversikt/" className={styles.link}>
          Se, sende og endre meldekort
          <ArrowRightIcon title="a11y-title" fontSize="1.5rem" className={styles.arrow} />
        </Link>
        <BodyShort className={styles.ingress}>Du kan sende meldekort mens du venter på svar på søknaden.</BodyShort>
      </section>
    </div>
  );
};
