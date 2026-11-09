import { CheckmarkIcon, ChevronDownIcon, ClockFillIcon } from '@navikt/aksel-icons';
import { type ReactNode, useId } from 'react';
import { progresjonTekst } from '../tidslinjeMapping';
import styles from './TidslinjeSteg.module.css';
import type { HendelseStegProps } from './types';

interface Props extends HendelseStegProps {
  title: string;
  children: ReactNode;
}

export function TidslinjeSteg({ hendelse, open, onToggle, dateFormatter, children, title }: Props) {
  const id = useId();
  const { progresjon, timestamp } = hendelse;
  let marker: ReactNode;
  let timelineLabel: string;
  let date: string | undefined;

  switch (progresjon) {
    case 'fullført':
      marker = <CheckmarkIcon />;
      date = dateFormatter.format(new Date(timestamp));
      timelineLabel = date;
      break;
    case 'aktiv':
      marker = <ClockFillIcon />;
      timelineLabel = 'Nå';
      break;
    case 'ikke-påbegynt':
      timelineLabel = 'Senere';
      break;
  }

  return (
    <li
      className={styles.step}
      data-progresjon={progresjon}
      data-expanded={open}
      aria-current={progresjon === 'aktiv' ? 'step' : undefined}
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
            aria-expanded={open}
            aria-controls={`${id}-content`}
            aria-describedby={date ? `${id}-date` : undefined}
            onClick={onToggle}
          >
            <span className={styles.labels}>
              <span className={styles.status} aria-hidden="true">
                {date ? (
                  <time id={`${id}-date`} dateTime={timestamp}>
                    {date}
                  </time>
                ) : (
                  timelineLabel
                )}
              </span>
              <span className={styles.title}>{title}</span>
              <span className={styles.srOnly}>{progresjonTekst[progresjon]}</span>
            </span>
            <ChevronDownIcon className={styles.chevron} aria-hidden="true" />
          </button>
        </h3>
        <div className={styles.content} id={`${id}-content`} hidden={!open}>
          {children}
        </div>
      </div>
    </li>
  );
}
