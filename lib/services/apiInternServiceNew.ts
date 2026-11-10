import sakerMedBehandlingerMock from 'lib/mock/mockbehandlinger';
import { fetchProxy } from 'lib/services/fetchProxy';
import type { Behandling, SakerMedBehandlingerResponse, SakMedBehandlinger } from 'lib/types/apiinternTypes';
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
export async function hentSakMedBehandlinger(
  saksnummer: string
): Promise<FetchResponse<SakMedBehandlinger | undefined>> {
  return {
    type: 'SUCCESS',
    data: sakerMedBehandlingerMock.find((e: SakMedBehandlinger) => e.saksnummer === saksnummer),
  };
}
export async function hentBehandling(
  saksnummer: string,
  behandlingReferanse: string
): Promise<FetchResponse<Behandling | undefined>> {
  return {
    type: 'SUCCESS',
    data: sakerMedBehandlingerMock
      .find((e: SakMedBehandlinger) => e.saksnummer === saksnummer)
      ?.behandlinger.find((behandling: Behandling) => behandling.behandlingReferanse === behandlingReferanse),
  };
}
