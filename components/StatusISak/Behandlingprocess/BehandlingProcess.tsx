'use client';
import { Process } from '@navikt/ds-react';
import type {
  Behandling,
  BehandlingsHendelse,
  BehandlingHendelseNavn,
  BehandlingHendelseProgresjon,
} from 'lib/services/apiInternService';
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
          key={hendelse.timestamp}
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
    case 'aktiv':
      return 'active';
    case 'fullført':
      return 'completed';
    case 'ikke-påbegynt':
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
    case 'UNDER_BEHANDLING':
      return 'Vi behandler siste del av søknaden din';
    case 'FERDIG_BEHANDLET':
      return 'Du får svar';
  }
}

function mapVenteStatusToText(hendelse: BehandlingsHendelse) {
  if (hendelse) {
    switch (hendelse.navn) {
      case 'SØKNAD_MOTTATT':
        return null;
      case 'ALDER_LOVVALG_MEDLEMSKAP':
        switch (hendelse.status) {
          case 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER':
            return 'Vi venter på informasjon fra utenlandske myndigheter';
          case 'MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER':
            return 'Vi har mottatt informasjon fra utenlandske myndigheter';
          case 'FERDIG':
            return 'Ferdig';
          case 'UNDER_BEHANDLING':
            return 'Under behandling';
        }
        break;
      case 'NAV_KONTOR':
        switch (hendelse.status) {
          case 'VENTER_PÅ_LEGEERKLÆRING':
            return 'Vi venter på legeerklæring';
          case 'PURRET_PÅ_LEGEERKLÆRING':
            return 'Vi har purret på legeerklæring';
          case 'LEGEERKLÆRING_MOTTATT':
            return 'Vi har mottatt legeerklæring';
          case 'FERDIG':
            return 'Ferdig';
          case 'UNDER_BEHANDLING':
            return 'Under behandling';
        }
        break;
      case 'UNDER_BEHANDLING':
        switch (hendelse.status) {
          case 'VENTER_I_KØ':
            return 'Venter i kø';
          case 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER':
            return 'Vi venter på informasjon fra utenlandske myndigheter';
          case 'MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER':
            return 'Vi har mottatt informasjon fra utenlandske myndigheter';
          case 'FERDIG':
            return 'Ferdig';
          case 'UNDER_BEHANDLING':
            return 'Under behandling';
        }
        break;
      case 'FERDIG_BEHANDLET':
        return null;
    }
  }
  return null;
}
