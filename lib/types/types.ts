export interface Dokument {
  tittel: string;
  timestamp: string;
  url: string;
  type: string;
}

export type VedleggType = 'ARBEIDSGIVER' | 'STUDIER' | 'ANDREBARN' | 'OMSORG' | 'UTLAND' | 'ANNET';

export interface Søknad {
  fnr?: string;
  innsendtDato: string;
  søknadId: string;
  innsendteVedlegg?: Array<{
    uri: string;
    tittel: string;
    type: 'I' | 'U' | 'N';
    innsendingsId: string;
    dato: string;
  }>;
  manglendeVedlegg?: Array<VedleggType>;
}

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
  ettersendteVedlegg: Array<{
    ettersending: Array<string>;
    vedleggType: VedleggType;
  }>;
}
