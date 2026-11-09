'use client';

import { Infopanel } from './Infopanel/Infopanel';
import { Heading } from 'node_modules/@navikt/ds-react/esm/typography/Heading';
import { ArrowRightIcon, PiggybankIcon } from '@navikt/aksel-icons';
import { Link } from 'node_modules/@navikt/ds-react/esm/link/Link';
import styles from './Statuskort.module.css';

interface Props {
  status: 'aktiv' | 'avsluttet' | 'ikke påbegynt';
  saksNummer: string;
  betalerTil: string;
  nesteUtbetalingSum: string;
  utbetalingsdato: string;
}

//TODO: avklare innhold og hvor det skal komme fra

export const Statuskort = ({ status, saksNummer, betalerTil, nesteUtbetalingSum, utbetalingsdato }: Props) => {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Heading level="2" size="small">
          Saken din
        </Heading>
        <PiggybankIcon title="a11y-title" fontSize="1.5rem" />
      </div>
      <Infopanel
        saksNummer={saksNummer}
        betalerTil={betalerTil}
        nesteUtbetaling={nesteUtbetalingSum}
        utbetalingsdato={utbetalingsdato}
      />
      <Link href="/aap/mine-aap/nb/oversikt/saksoversikt/" className={styles.link}>
        Saksoversikt
        <ArrowRightIcon title="a11y-title" fontSize="1.5rem" className={styles.arrow} />
      </Link>
    </section>
  );
};
