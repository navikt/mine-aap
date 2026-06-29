import type { SoknadMedEttersendingerResponse } from 'lib/types/types';

const mockSøknerMedEttersending: SoknadMedEttersendingerResponse = [
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

export { mockSøknerMedEttersending };
