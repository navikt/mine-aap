import { Søknad } from 'lib/types/types';

export const mockSøknader: Søknad[] = [
  {
    innsendtDato: '2022-08-30T10:54:49.737467',
    søknadId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    innsendteVedlegg: [
      {
        journalpostId: '1',
        dokumentId: '1',
        tittel: 'Søknad om AAP',
        type: 'I',
        innsendingsId: '',
        dato: '2022-08-30T08:53:47.000Z',
      },
      {
        journalpostId: '111',
        dokumentId: '222',
        tittel: 'Dokumentasjon fra arbeidsgiver',
        type: 'I',
        innsendingsId: 'f3297977-618e-44e2-9ad4-9749b5790b35',
        dato: '2022-09-30T10:54:51.034007',
      },
      {
        journalpostId: '333',
        dokumentId: '444',
        tittel: 'Annen dokumentasjon',
        type: 'I',
        innsendingsId: 'ef4114c6-2308-445b-a5ff-1bac6b85873f',
        dato: '2022-09-30T10:54:51.047477',
      },
    ],
    manglendeVedlegg: ['ARBEIDSGIVER'],
  },
  { innsendtDato: '2022-08-30T08:53:47.215149', søknadId: '835a12fc-e642-42da-b182-5169c488842f' },
];
