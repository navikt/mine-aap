'use client';

import { Process } from '@navikt/ds-react';
import type {
  Behandling,
  BehandlingHendelse,
  BehandlingHendelseNavn,
  BehandlingHendelseStatus,
} from 'lib/services/apiInternService';

interface Props {
  behandling: Behandling;
}
export const BehandlingProcess = ({ behandling }: Props) => {
  return (
    <Process>
      {behandling.hendelser.map((hendelse) => (
        <Process.Event
          key={hendelse.timestamp}
          status={mapHendelseStatusToEventStatus(hendelse.status)}
          title={mapHendelseNavn(hendelse.navn)}
          timestamp={mapHendelseBeskrivelse(hendelse)}
        />
      ))}
    </Process>
  );
};
function mapHendelseStatusToEventStatus(status: BehandlingHendelseStatus) {
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
      return 'Søknad mottatt';
    case 'VENTER_PÅ_LEGEERKLÆRING':
      return 'Venter på legeerklæring';
    case 'UNDER_BEHANDLING':
      return 'Under behandling';
    case 'AVSLUTTET':
      return 'Ferdig behandlet';
    case 'SØKNAD_TRUKKET':
      return 'Søknad trukket';
  }
}
function mapHendelseBeskrivelse(hendelse: BehandlingHendelse) {
  switch (hendelse.navn) {
    case 'SØKNAD_MOTTATT':
      return `${hendelse.timestamp}`;
    case 'VENTER_PÅ_LEGEERKLÆRING':
      return 'Vi har bedt om legeerklæring fra fastlegen din';
    case 'UNDER_BEHANDLING':
      return 'Vi vurderer...';
    case 'AVSLUTTET':
      return 'Ferdig behandlet';
    case 'SØKNAD_TRUKKET':
      return 'Søknad trukket';
  }
}
