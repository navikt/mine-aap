'use client';
import { ArrowRightIcon, PiggybankIcon } from '@navikt/aksel-icons';
import type {
  Behandling,
  BehandlingHendelse,
  BehandlingHendelseNavn,
  BehandlingHendelseProgresjon,
} from 'lib/types/apiinternTypes';
import { Link } from 'node_modules/@navikt/ds-react/esm/link/Link';
import { Process } from 'node_modules/@navikt/ds-react/esm/process/Process';
import { Heading } from 'node_modules/@navikt/ds-react/esm/typography/Heading';
import styles from './BehandlingsCard.module.css';

interface Props {
  saksnummer: string;
  behandling: Behandling;
}

export const BehandlingsCard = ({ saksnummer, behandling }: Props) => {
  const adjacentHendelser = getAdjacentHendelser(behandling.hendelser);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Heading level="2" size="small">
          {behandling.behandlingType}
        </Heading>
        <PiggybankIcon title="a11y-title" fontSize="1.5rem" />
      </div>
      <Process className={styles.process}>
        {adjacentHendelser?.map((hendelse) => (
          <Process.Event
            className={styles.event}
            key={hendelse.navn}
            title={mapHendelseNavn(hendelse.navn)}
            status={mapHendelseProgresjonToEventStatus(hendelse.progresjon)}
          ></Process.Event>
        ))}
      </Process>
      <Link
        href={`/aap/mine-aap/nb/oversikt/${saksnummer}/behandling/${behandling.behandlingReferanse}/`}
        className={styles.link}
      >
        Saksoversikt
        <ArrowRightIcon title="a11y-title" fontSize="1.5rem" className={styles.arrow} />
      </Link>
    </section>
  );
};

function getAdjacentHendelser(hendelser: BehandlingHendelse[]) {
  // Find the index of the active event
  // Extract the active event, plus the ones before and after it
  const index = hendelser.findIndex((hendelse) => hendelse.progresjon === 'AKTIV');
  if (index !== -1) {
    const start = Math.max(0, index - 1);
    const adjacentHendelserList = hendelser.slice(start, index + 2);
    return adjacentHendelserList;
  }
}

function mapHendelseProgresjonToEventStatus(status: BehandlingHendelseProgresjon) {
  switch (status) {
    case 'AKTIV':
      return 'active';
    case 'FULLFØRT':
      return 'completed';
    case 'IKKE_PÅBEGYNT':
      return 'uncompleted';
  }
}

function mapHendelseNavn(navn: BehandlingHendelseNavn) {
  switch (navn) {
    case 'SØKNAD_MOTTATT':
      return 'Søknaden din er mottatt';
    case 'ALDER_LOVVALG_MEDLEMSKAP':
      return 'Vi sjekker søknaden din';
    case 'NAV_KONTOR':
      return 'Vi kartlegger situasjonen din';
    case 'NAY':
      return 'Vi behandler';
    case 'FERDIG_BEHANDLET':
      return 'Du får svar';
  }
}
