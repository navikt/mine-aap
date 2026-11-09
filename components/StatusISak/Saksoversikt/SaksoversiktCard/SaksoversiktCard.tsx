'use client';

import { Detail } from 'node_modules/@navikt/ds-react/esm/typography/Detail';
import styles from './SaksoversiktCard.module.css';

//TODO: avklare innhold og hvor det skal komme fra, en haug av intl oppgaver i etterkant
export const SaksoversiktCard = () => {
  return (
    <section className={styles.container}>
      <dl className={styles.list}>
        <div className={styles.listItem}>
          <dt>
            <Detail uppercase>Status</Detail>
          </dt>
          <dd>
            <Detail className={styles.detail} weight="semibold">
              {'Godkjent'}
            </Detail>
          </dd>
        </div>
        <div className={styles.gridSection}>
          <div className={styles.listItem}>
            <dt>
              <Detail uppercase>Tid igjen</Detail>
            </dt>
            <dd>
              <Detail className={styles.detail} weight="semibold">
                {'2 år og 4 uker'}
              </Detail>
            </dd>
          </div>
          <div className={styles.listItem}>
            <dt>
              <Detail uppercase>Dagsats</Detail>
            </dt>
            <dd>
              <Detail className={styles.detail} weight="semibold">
                {'600 kr'}
              </Detail>
            </dd>
          </div>
          <div className={styles.listItem}>
            <dt>
              <Detail uppercase>Barnetillegg</Detail>
            </dt>
            <dd>
              <Detail className={styles.detail} weight="semibold">
                {'Nei'}
              </Detail>
            </dd>
          </div>
          <div className={styles.listItem}>
            <dt>
              <Detail uppercase>Arbeidsevne</Detail>
            </dt>
            <dd>
              <Detail className={styles.detail} weight="semibold">
                {'50%'}
              </Detail>
            </dd>
          </div>
          <div className={styles.listItem}>
            <dt>
              <Detail uppercase>Inntektsgrunnlag</Detail>
            </dt>
            <dd>
              <Detail className={styles.detail} weight="semibold">
                {'600 000 kr'}
              </Detail>
            </dd>
          </div>
          <div className={styles.listItem}>
            <dt>
              <Detail uppercase>Ufør</Detail>
            </dt>
            <dd>
              <Detail className={styles.detail} weight="semibold">
                {'Nei'}
              </Detail>
            </dd>
          </div>
        </div>
      </dl>
    </section>
  );
};
