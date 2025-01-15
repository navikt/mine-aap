export interface Dokument {
  journalpostId?: string;
  dokumentId?: string;
  tittel: string;
  type: 'I' | 'U' | 'N';
  innsendingsId: string;
  dato: string;
}

export type VedleggType = 'ARBEIDSGIVER' | 'STUDIER' | 'ANDREBARN' | 'OMSORG' | 'UTLAND' | 'ANNET';

export interface MellomlagretSøknad {
  timestamp: string;
}

export interface Vedleggskrav {
  type: 'STUDIESTED' | 'FOSTERFORELDER' | 'ANNET';
  dokumentasjonstype: string;
  beskrivelse: string;
}

export interface OpplastetVedlegg {
  name: string;
  size: number;
  vedleggId?: string;
  isUploading: boolean;
  file: File;
}

export interface Ettersendelse {
  søknadId?: string;
  totalFileSize: number;
  ettersendteVedlegg: Array<EttersendteVedlegg>;
}

export interface EttersendelseBackendState {
  søknadId?: string;
  ettersendteVedlegg: Array<EttersendteVedlegg>;
}

export interface EttersendteVedlegg {
  ettersending: Array<string>;
  vedleggType: VedleggType;
}

export interface InnsendingBackendState {
  filer: InnsendingFil[];
  kvittering: Kvittering;
}

export interface Kvittering {
  mottattdato: Date;
  temaer: {
    vedlegg: {
      type: string;
      overskrift: string;
      underblokker: VedleggListe[];
    };
  };
}

export interface VedleggListe {
  type: string;
  felt: string;
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
