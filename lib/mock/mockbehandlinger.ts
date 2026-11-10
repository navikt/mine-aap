import type { SakerMedBehandlingerResponse } from 'lib/types/apiinternTypes';

const sakerMedBehandlingerMock: SakerMedBehandlingerResponse = [
  {
    saksnummer: 'sak1',
    sakStatus: 'SOKNAD_UNDER_BEHANDLING',
    behandlinger: [
      {
        behandlingReferanse: '778bdf1c-e0ae-4197-bc46-13aa1cdd08e9',
        avsluttet: false,
        behandlingType: 'SØKNAD',
        hendelser: [
          {
            sistEndret: '2025-04-01T12:30:00',
            progresjon: 'FULLFØRT',
            navn: 'SØKNAD_MOTTATT',
          },
          {
            sistEndret: '2025-04-02T09:00:00',
            progresjon: 'AKTIV',
            status: 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER',
            navn: 'ALDER_LOVVALG_MEDLEMSKAP',
          },
          {
            sistEndret: null,
            progresjon: 'IKKE_PÅBEGYNT',
            status: null,
            navn: 'NAV_KONTOR',
          },
          {
            sistEndret: null,
            progresjon: 'IKKE_PÅBEGYNT',
            status: null,
            navn: 'NAY',
          },
          {
            sistEndret: null,
            progresjon: 'IKKE_PÅBEGYNT',
            navn: 'FERDIG_BEHANDLET',
          },
        ],
      },
    ],
  },
];

export default sakerMedBehandlingerMock;
