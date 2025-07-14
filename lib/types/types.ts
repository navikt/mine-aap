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

export interface InnsendingSøknad {
  mottattDato: string;
  journalpostId?: string;
  innsendingsId: string;
}

export interface MineAapSoknadMedEttersendinger {
  mottattDato: string;
  journalpostId?: string;
  innsendingsId: string;
  ettersendinger: Array<InnsendingSøknad>;
}

export interface MineAapSoknadMedEttersendingNy {
  mottattDato: string; // LocalDateTime
  journalpostId?: string;
  innsendingsId: string;
  ettersendinger: Array<MineAapEttersendingNy>;
}

export interface MineAapEttersendingNy {
  mottattDato: string; // LocalDateTime
  journalpostId?: string;
  innsendingsId: string;
}

export type MeldekortSystem = 'FELLES' | 'AAP';
