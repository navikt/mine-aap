'use client';

import { Detail } from 'node_modules/@navikt/ds-react/esm/typography/Detail';
import styles from './Infopanel.module.css';

interface Props {
  saksNummer: string;
  betalerTil: string;
  nesteUtbetaling: string;
  utbetalingsdato: string;
}
//TODO: avklare innhold og hvor det skal komme fra

export const Infopanel = ({ saksNummer, betalerTil, nesteUtbetaling, utbetalingsdato }: Props) => {
  return (
    <dl className={styles.list}>
      <div className={styles.listItem}>
        <dt>
          <Detail uppercase>Saksnummer</Detail>
        </dt>
        <dd>
          <Detail className={styles.detail}>{saksNummer}</Detail>
        </dd>
      </div>
      <div className={styles.listItem}>
        <dt>
          <Detail uppercase>Betaler til</Detail>
        </dt>
        <dd>
          <Detail className={styles.detail}>{betalerTil}</Detail>
        </dd>
      </div>
      <div className={styles.listItem}>
        <dt>
          <Detail uppercase>Neste utbetaling</Detail>
        </dt>
        <dd>
          <Detail className={styles.detail}>{nesteUtbetaling}</Detail>
        </dd>
      </div>
      <div className={styles.listItem}>
        <dt>
          <Detail uppercase>Utbetalingsdato</Detail>
        </dt>
        <dd>
          <Detail className={styles.detail}>{utbetalingsdato}</Detail>
        </dd>
      </div>
    </dl>
  );
};
