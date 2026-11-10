'use client';
import { Process } from '@navikt/ds-react';
import type {
  Behandling,
  BehandlingHendelse,
  BehandlingHendelseNavn,
  BehandlingHendelseProgresjon,
} from 'lib/types/apiinternTypes';
import styles from './BehandlingProcess.module.css';

interface Props {
  behandling: Behandling;
}

//TODO: Remake av komponent for å håndtere nye krav og nytt design
export const BehandlingProcess = ({ behandling }: Props) => {
  return (
    <Process className={styles.process}>
      {behandling.hendelser.map((hendelse) => (
        <Process.Event
          key={hendelse.sistEndret}
          status={mapHendelseProgresjonToEventStatus(hendelse.progresjon)}
          title={mapHendelseNavn(hendelse.navn)}
        >
          {mapVenteStatusToText(hendelse)}
        </Process.Event>
      ))}
    </Process>
  );
};
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
      return 'Vi behandler siste del av søknaden din';
    case 'FERDIG_BEHANDLET':
      return 'Du får svar';
  }
}

function mapVenteStatusToText(hendelse: BehandlingHendelse) {
  if (hendelse) {
    switch (hendelse.navn) {
      case 'SØKNAD_MOTTATT':
        return null;
      case 'ALDER_LOVVALG_MEDLEMSKAP':
        if (hendelse.progresjon === 'FULLFØRT') {
          return `Ferdig ${hendelse.sistEndret}`;
        }
        switch (hendelse.status) {
          case 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER':
            return 'Vi venter på informasjon fra utenlandske myndigheter';
          case 'MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER':
            return 'Vi har mottatt informasjon fra utenlandske myndigheter';
        }
        break;
      case 'NAV_KONTOR':
        switch (hendelse.status) {
          case 'VENTER_PÅ_LEGEERKLÆRING':
            return 'Vi venter på legeerklæring';
          case 'PURRET_PÅ_LEGERERKLÆRING':
            return 'Vi har purret på legeerklæring';
          case 'MOTTATT_LEGEERKLÆRING':
            return 'Vi har mottatt legeerklæring';
        }
        break;
      case 'NAY':
        switch (hendelse.status) {
          case 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER':
            return 'Vi venter på informasjon fra utenlandske myndigheter';
          case 'MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER':
            return 'Vi har mottatt informasjon fra utenlandske myndigheter';
        }
        break;
      case 'FERDIG_BEHANDLET':
        return null;
    }
  }
  return null;
}
