import type { SakerMedBehandlingerResponse } from 'lib/types/apiinternTypes';

const sakerMedBehandlingerMock: SakerMedBehandlingerResponse = [
  {
    saksnummer: 'sak1',
    sakStatus: 'SOKNAD_UNDER_BEHANDLING',
    behandlinger: [
      {
        behandlingReferanse: 'c2fe416f-ba35-4f23-878d-397c8becbab1',
        avsluttet: false,
        behandlingType: 'SØKNAD',
        hendelser: [
          { sistEndret: '2026-11-12T15:28:53.477', progresjon: 'FULLFØRT', navn: 'SØKNAD_MOTTATT' },
          {
            sistEndret: '2026-11-12T15:31:45.235',
            progresjon: 'FULLFØRT',
            status: null,
            navn: 'ALDER_LOVVALG_MEDLEMSKAP',
          },
          {
            sistEndret: '2026-11-12T15:31:47.575',
            progresjon: 'AKTIV',
            status: 'VENTER_PÅ_LEGEERKLÆRING',
            navn: 'NAV_KONTOR',
          },
          { sistEndret: null, progresjon: 'IKKE_PÅBEGYNT', status: null, navn: 'NAY' },
          { sistEndret: null, progresjon: 'IKKE_PÅBEGYNT', navn: 'FERDIG_BEHANDLET' },
        ],
      },
    ],
  },
];

export default sakerMedBehandlingerMock;
