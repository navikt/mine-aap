import type { FetchResponse } from 'lib/utils/api-fetch';

export type BehandlingHendelseNavn =
  | 'SØKNAD_MOTTATT'
  | 'ALDER_LOVVALG_MEDLEMSKAP' // NAY
  | 'NAV_KONTOR' // Nav-kontor
  | 'UNDER_BEHANDLING' // NAY
  | 'FERDIG_BEHANDLET';
export type BehandlingHendelseProgresjon = 'aktiv' | 'fullført' | 'ikke-påbegynt';
export type BehandlingHendelseStatus =
  | 'VENTER_PÅ_LEGEERKLÆRING' // Nav-kontor
  | 'PURRET_PÅ_LEGEERKLÆRING' // Nav-kontor
  | 'LEGEERKLÆRING_MOTTATT' // Nav-kontor
  | 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER'
  | 'FERDIG'
  | 'UNDER_BEHANDLING';

export type BehandlingHendelseMottattSøknad = {
  navn: 'SØKNAD_MOTTATT';
  timestamp: string;
  progresjon: BehandlingHendelseProgresjon;
};
export type BehandlingHendelseAlderLovvalgMedlemskap = {
  navn: 'ALDER_LOVVALG_MEDLEMSKAP';
  timestamp: string;
  progresjon: BehandlingHendelseProgresjon;
  status?:
    | 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER'
    | 'MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER' // NB: dette har vi kanskje ikke
    | 'FERDIG'
    | 'UNDER_BEHANDLING';
};
export type BehandlingHendelseNavKontor = {
  navn: 'NAV_KONTOR';
  timestamp: string;
  progresjon: BehandlingHendelseProgresjon;
  status?:
    | 'VENTER_PÅ_LEGEERKLÆRING'
    | 'PURRET_PÅ_LEGEERKLÆRING'
    | 'LEGEERKLÆRING_MOTTATT'
    | 'FERDIG'
    | 'UNDER_BEHANDLING';
};
export type BehandlingHendelseUnderBehandling = {
  navn: 'UNDER_BEHANDLING';
  timestamp: string;
  progresjon: BehandlingHendelseProgresjon;
  status?:
    | 'VENTER_I_KØ'
    | 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER'
    | 'MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER' // NB: dette har vi kanskje ikke
    | 'FERDIG'
    | 'UNDER_BEHANDLING';
};
export type BehandlingHendelseFerdigBehandlet = {
  navn: 'FERDIG_BEHANDLET';
  timestamp: string;
  progresjon: BehandlingHendelseProgresjon;
};
export type BehandlingHendelse =
  | BehandlingHendelseMottattSøknad
  | BehandlingHendelseAlderLovvalgMedlemskap
  | BehandlingHendelseNavKontor
  | BehandlingHendelseUnderBehandling
  | BehandlingHendelseFerdigBehandlet;

export type Behandling = {
  behandlingId: string;
  behandlingType: string;
  hendelser: BehandlingHendelse[];
  vedtakFattet: boolean;
  opprettet: string;
};
export type Sak = {
  sakId: string;
  sakStatus: 'SOKNAD_UNDER_BEHANDLING' | 'REVURDERING_UNDER_BEHANDLING' | 'FERDIGBEHANDLET';
  behandlinger: Behandling[];
};
const behandlinger: Behandling[] = [
  {
    behandlingId: 'behandling1',
    behandlingType: 'SØKNAD',
    vedtakFattet: false,
    opprettet: '2026-09-09',
    hendelser: [
      {
        navn: 'SØKNAD_MOTTATT',
        timestamp: '2026-01-01',
        progresjon: 'fullført',
      },
      {
        navn: 'ALDER_LOVVALG_MEDLEMSKAP',
        timestamp: '2026-03-01',
        progresjon: 'fullført',
        status: 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER',
      },
      {
        navn: 'NAV_KONTOR',
        timestamp: '2026-03-01',
        progresjon: 'aktiv',
        status: 'VENTER_PÅ_LEGEERKLÆRING',
      },
      {
        navn: 'UNDER_BEHANDLING',
        timestamp: '2026-05-01',
        progresjon: 'ikke-påbegynt',
      },
      {
        navn: 'FERDIG_BEHANDLET',
        timestamp: '2026-05-01',
        progresjon: 'ikke-påbegynt',
      },
    ],
  },
];
const sak: Sak = {
  sakId: 'sak1',
  sakStatus: 'SOKNAD_UNDER_BEHANDLING',
  behandlinger,
};

export async function hentSakMedBehandlinger(): Promise<FetchResponse<Sak | null>> {
  return {
    type: 'SUCCESS',
    data: sak,
  };
}
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
