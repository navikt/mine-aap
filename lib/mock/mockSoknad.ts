import { Søknad } from 'lib/types/types';

export const mockSøknader: Søknad[] = [
  {
    innsendtDato: '2022-08-30T10:54:49.737467',
    søknadId: '32e3602e-7a7b-4440-89ca-8e2332d57bb9',
    innsendteVedlegg: [
      { vedleggType: 'STUDIER', innsendtDato: '2022-08-30T10:54:51.034007' },
      { vedleggType: 'ANNET', innsendtDato: '2022-08-30T10:54:51.047477' },
    ],
    manglendeVedlegg: ['OMSORG'],
  },
  { innsendtDato: '2022-08-30T08:53:47.215149', søknadId: '835a12fc-e642-42da-b182-5169c488842f' },
];
