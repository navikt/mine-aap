import { fetchProxy } from 'lib/services/fetchProxy';
import type { SakerMedBehandlingerResponse } from 'lib/types/apiinternTypes';
import type { FetchResponse } from 'lib/utils/api-fetch';
import { isMock } from 'lib/utils/environments';

const apiInternBaseUrl = process.env.API_INTERN_URL;
const apiInternAudience = process.env.API_INTERN_AUDIENCE ?? '';

export async function hentSakerMedBehandlinger(): Promise<FetchResponse<SakerMedBehandlingerResponse>> {
  if (isMock()) {
    return {
      type: 'SUCCESS',
      status: 200,
      data: sakerMedBehandlingerMock,
    };
  }
  return fetchProxy<SakerMedBehandlingerResponse>(
    `${apiInternBaseUrl}/mine-aap/saker-med-behandlinger`,
    apiInternAudience,
    'GET'
  );
}
const sakerMedBehandlingerMock: SakerMedBehandlingerResponse = [
  {
    saksnummer: 'sak1',
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
