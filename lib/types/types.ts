import type { components as innsendingComponents, paths as innsendingPaths } from './innsendingschema';

export interface Dokument {
  journalpostId?: string;
  dokumentId?: string;
  tittel: string;
  type: 'I' | 'U' | 'N';
  innsendingsId: string;
  dato: string;
}

export type VedleggType = 'ARBEIDSGIVER' | 'STUDIER' | 'ANDREBARN' | 'OMSORG' | 'UTLAND' | 'ANNET';

export interface Ettersendelse {
  søknadId?: string;
  totalFileSize: number;
  ettersendteVedlegg: Array<EttersendteVedlegg>;
}

export interface EttersendteVedlegg {
  ettersending: Array<string>;
  vedleggType: VedleggType;
}

export interface InnsendingBackendState {
  filer: InnsendingFil[];
}

export interface InnsendingFil {
  id: string;
  tittel: string;
}

export type SoknadMedEttersendingerResponse =
  innsendingPaths['/innsending/søknadmedettersendinger']['get']['responses']['200']['content']['application/json'];

export type SoknadMedEttersendinger = innsendingComponents['schemas']['innsending.dto.MineAapSoknadMedEttersendingNy'];
export type Ettersending = innsendingComponents['schemas']['innsending.dto.MineAapEttersendingNy'];
