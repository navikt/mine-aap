import { CheckmarkIcon, ChevronDownIcon, ClockFillIcon } from '@navikt/aksel-icons';
import type { BehandlingHendelse } from 'lib/types/apiinternTypes';
import { type ReactNode, useId } from 'react';
import { progresjonTekst } from '../tidslinjeMapping';
import styles from './TidslinjeSteg.module.css';
import type { HendelseStegProps } from './types';

interface Props {
  title: string;
  hendelse: BehandlingHendelse;
  steg: HendelseStegProps;
  children: ReactNode;
}

export function TidslinjeSteg({ hendelse, steg, children, title }: Props) {
  const id = useId();
  const { progresjon, sistEndret } = hendelse;
  let marker: ReactNode;
  let timelineLabel = '';
  let date: string | undefined;

  switch (progresjon) {
    case 'FULLFØRT':
      marker = <CheckmarkIcon />;
      if (sistEndret) {
        date = steg.dateFormatter.format(new Date(sistEndret));
        timelineLabel = date;
      }
      break;
    case 'AKTIV':
      marker = <ClockFillIcon />;
      timelineLabel = 'Nå';
      break;
    case 'IKKE_PÅBEGYNT':
      timelineLabel = 'Senere';
      break;
  }

  return (
    <li
      className={styles.step}
      data-progresjon={progresjon}
      data-expanded={steg.open}
      aria-current={progresjon === 'AKTIV' ? 'step' : undefined}
    >
      <div className={styles.card}>
        <span className={styles.marker} aria-hidden="true">
          {marker}
        </span>
        <h3 className={styles.heading}>
          <button
            type="button"
            className={styles.header}
            id={`${id}-header`}
            aria-expanded={steg.open}
            aria-controls={`${id}-content`}
            aria-describedby={date ? `${id}-date` : undefined}
            onClick={steg.onToggle}
          >
            <span className={styles.labels}>
              <span className={styles.status} aria-hidden="true">
                {date ? (
                  <time id={`${id}-date`} dateTime={date}>
                    {date}
                  </time>
                ) : (
                  timelineLabel
                )}
              </span>
              <span className={styles.title}>{title}</span>
              <span className={styles.srOnly}>{progresjonTekst()[progresjon]}</span>
            </span>
            <ChevronDownIcon className={styles.chevron} aria-hidden="true" />
          </button>
        </h3>
        <div className={styles.content} id={`${id}-content`} hidden={!steg.open}>
          {children}
        </div>
      </div>
    </li>
  );
}
