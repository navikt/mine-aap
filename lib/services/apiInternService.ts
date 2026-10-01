import { Process } from '@navikt/ds-react';
import type { FetchResponse } from 'lib/utils/api-fetch';

export type BehandlingHendelseNavn =
  | 'SØKNAD_MOTTATT'
  | 'VENTER_PÅ_LEGEERKLÆRING'
  | 'UNDER_BEHANDLING'
  | 'AVSLUTTET'
  | 'SØKNAD_TRUKKET';
export type BehandlingHendelseStatus = 'aktiv' | 'fullført' | 'ikke-påbegynt';
export type BehandlingHendelse = {
  navn: BehandlingHendelseNavn;
  timestamp: string;
  status: BehandlingHendelseStatus;
};
export type Behandling = {
  behandlingId: string;
  behandlingType: string;
  hendelser: BehandlingHendelse[];
  vedtakFattet: boolean;
};
const behandlinger: Behandling[] = [
  {
    behandlingId: 'behandling1',
    behandlingType: 'SØKNAD',
    vedtakFattet: false,
    hendelser: [
      {
        navn: 'SØKNAD_MOTTATT',
        timestamp: '2026-01-01',
        status: 'fullført',
      },
      {
        navn: 'UNDER_BEHANDLING',
        timestamp: '2026-03-01',
        status: 'fullført',
      },
      {
        navn: 'VENTER_PÅ_LEGEERKLÆRING',
        timestamp: '2026-03-01',
        status: 'aktiv',
      },
      {
        navn: 'AVSLUTTET',
        timestamp: '2026-05-01',
        status: 'ikke-påbegynt',
      },
    ],
  },
];
export async function hentBehandlinger(): Promise<FetchResponse<Behandling[]>> {
  return {
    type: 'SUCCESS',
    data: behandlinger,
  };
}
export async function hentBehandling(behandlingId: string): Promise<FetchResponse<Behandling | undefined>> {
  return {
    type: 'SUCCESS',
    data: behandlinger.find((e) => e.behandlingId === behandlingId),
  };
}
