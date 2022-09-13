import { Søknad } from 'lib/types/types';

export const mockSøknader: Søknad[] = [
  {
    innsendtDato: '2022-08-30T10:54:49.737467',
    søknadId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    innsendteVedlegg: [
      { vedleggType: 'UTLAND', innsendtDato: '2022-08-30T10:54:51.034007' },
      { vedleggType: 'ANNET', innsendtDato: '2022-08-30T10:54:51.047477' },
    ],
    manglendeVedlegg: ['ARBEIDSGIVER'],
  },
  { innsendtDato: '2022-08-30T08:53:47.215149', søknadId: '835a12fc-e642-42da-b182-5169c488842f' },
];
