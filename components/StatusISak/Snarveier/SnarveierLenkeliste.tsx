'use client';

import { Heading, LinkCard } from '@navikt/ds-react';
import styles from './SnarveierLenkeliste.module.css';

//TODO: Legge inn riktige URLer

export const SnarveierLenkeliste = () => {
  return (
    <section className={styles.container}>
      <Heading size="xsmall" level="4" className={styles.heading}>
        Snarveier
      </Heading>
      <ul className={styles.list}>
        <li>
          <LinkCard className={styles.card}>
            <LinkCard.Title>
              <LinkCard.Anchor className={styles.title} href="/aap/mine-aap/nb/oversikt/saksoversikt">
                Saksoversikt
              </LinkCard.Anchor>
            </LinkCard.Title>
          </LinkCard>
        </li>
        <li>
          <LinkCard className={styles.card}>
            <LinkCard.Title>
              <LinkCard.Anchor className={styles.title} href="/utbetalinger">
                Utbetalinger
              </LinkCard.Anchor>
            </LinkCard.Title>
          </LinkCard>
        </li>
        <li>
          <LinkCard className={styles.card}>
            <LinkCard.Title>
              <LinkCard.Anchor className={styles.title} href="/eksempel">
                Ettersend dokumentasjon
              </LinkCard.Anchor>
            </LinkCard.Title>
          </LinkCard>
        </li>
        <li>
          <LinkCard className={styles.card}>
            <LinkCard.Title>
              <LinkCard.Anchor className={styles.title} href="/eksempel">
                Meld fra om endring
              </LinkCard.Anchor>
            </LinkCard.Title>
          </LinkCard>
        </li>
        <li>
          <LinkCard className={styles.card}>
            <LinkCard.Title>
              <LinkCard.Anchor className={styles.title} href="/eksempel">
                Send klage
              </LinkCard.Anchor>
            </LinkCard.Title>
          </LinkCard>
        </li>
      </ul>
    </section>
  );
};
