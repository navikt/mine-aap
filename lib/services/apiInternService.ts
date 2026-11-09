import type { FetchResponse } from 'lib/utils/api-fetch';
import mockJournalpost from 'lib/mock/mockJournalpost';
import mockBehandlinger from 'lib/mock/mockbehandlinger';
import type { JournalpostProps } from 'components/StatusISak/Dokumentvisning/JournalpostInterfaces';

export type Sak = {
  sakId: string;
  sakStatus: 'SOKNAD_UNDER_BEHANDLING' | 'REVURDERING_UNDER_BEHANDLING' | 'FERDIGBEHANDLET';
  behandlinger: Behandling[];
};

export type Behandling = {
  behandlingId: string;
  behandlingType: string;
  navn: string;
  hendelser: BehandlingsHendelse[];
  vedtakFattet: boolean;
  vedtakFattetDato?: string;
  opprettet: string;
};

export type BehandlingsHendelse = {
  timestamp: string;
  progresjon: BehandlingHendelseProgresjon;
} & (
  | {
      navn: 'SØKNAD_MOTTATT' | 'FERDIG_BEHANDLET';
      status?: never;
    }
  | {
      navn: 'ALDER_LOVVALG_MEDLEMSKAP';
      status?: AlderLovvalgMedlemskapVenteStatuser;
    }
  | {
      navn: 'NAV_KONTOR';
      status?: NavKontorVenteStatuser;
    }
  | {
      navn: 'UNDER_BEHANDLING';
      status?: UnderBehandlingVenteStatuser;
    }
);

export type BehandlingHendelseNavn = BehandlingsHendelse['navn'];

export type BehandlingHendelseProgresjon = 'aktiv' | 'fullført' | 'ikke-påbegynt';

export type AlderLovvalgMedlemskapVenteStatuser =
  | 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER'
  | 'MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER'
  | 'FERDIG'
  | 'UNDER_BEHANDLING';

export type NavKontorVenteStatuser =
  | 'VENTER_PÅ_LEGEERKLÆRING'
  | 'PURRET_PÅ_LEGEERKLÆRING'
  | 'LEGEERKLÆRING_MOTTATT'
  | 'FERDIG'
  | 'UNDER_BEHANDLING';

export type UnderBehandlingVenteStatuser =
  | 'VENTER_I_KØ'
  | 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER'
  | 'MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER' // NB: dette har vi kanskje ikke
  | 'FERDIG'
  | 'UNDER_BEHANDLING';


const behandlinger = mockBehandlinger;

const sak: Sak = {
  sakId: 'sak1',
  sakStatus: 'SOKNAD_UNDER_BEHANDLING',
  behandlinger,
};

const journalpost = mockJournalpost;
  
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

export async function hentJournalpost(): Promise<FetchResponse<JournalpostProps>> {
  return {
    type: 'SUCCESS',
    data: journalpost,
  };
}

