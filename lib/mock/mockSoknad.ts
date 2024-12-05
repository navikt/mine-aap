import { InnsendingSøknad, MineAapSoknadMedEttersendinger, MineAapSoknadMedEttersendingNy } from 'lib/types/types';

const mockSøknaderInnsending: InnsendingSøknad[] = [
  {
    mottattDato: '2024-01-30T00:01:00.000000',
    journalpostId: '1',
    innsendingsId: 'udsf-asdl-jsadf-kfljs',
  },
  {
    mottattDato: '2024-02-30T00:01:00.000000',
    journalpostId: '2',
    innsendingsId: 'udsf-asdl-jsadf-dsfff',
  },
];

const mockEttersendelserSoknad: MineAapSoknadMedEttersendinger = {
  mottattDato: '2024-01-30T00:01:00.000000',
  journalpostId: '1',
  innsendingsId: 'udsf-asdl-jsadf-kfljs',
  ettersendinger: [
    {
      mottattDato: '2024-02-30T00:01:00.000000',
      journalpostId: '2',
      innsendingsId: 'udsf-asdl-jsadf-dsfff',
    },
  ],
};

const mockSøknerMedEttersending: MineAapSoknadMedEttersendingNy[] = [
  {
    mottattDato: '2024-01-30T00:01:00.000000',
    journalpostId: '1',
    innsendingsId: '1',
    ettersendinger: [
      {
        mottattDato: '2024-02-30T00:01:00.000000',
        journalpostId: '2',
        innsendingsId: '2',
      },
    ],
  },
];

export { mockSøknaderInnsending, mockEttersendelserSoknad, mockSøknerMedEttersending };
