export interface Dokument {
  tittel: string;
  timestamp: string;
  url: string;
  type: string;
}

export interface Søknad {
  fnr?: string;
  innsendtDato: string;
  søknadId: string;
  innsendteVedlegg?: Array<{
    innsendtDato: string;
    vedleggType: 'ARBEIDSGIVER' | 'STUDIER' | 'ANDREBARN' | 'OMSORG' | 'UTLAND' | 'ANNET';
  }>;
  manglendeVedlegg?: Array<
    'ARBEIDSGIVER' | 'STUDIER' | 'ANDREBARN' | 'OMSORG' | 'UTLAND' | 'ANNET'
  >;
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
  file: File;
}
