import { MeldekortSystem } from 'lib/types/types';
import { isMock } from 'lib/utils/environments';
import { fetchProxy } from 'lib/services/fetchProxy';
import { logError } from '@navikt/aap-felles-utils';
import { mockAnsvarligMeldekortSystem } from 'lib/mock/mockAnsvarligMeldekortSystem';

const meldekortBackendBaseUrl = process.env.MELDEKORT_BACKEND_URL;
const meldekortBackendAudience = process.env.MELDEKORT_BACKEND_AUDIENCE ?? '';

export const hentAnsvarligMeldekortsystem = async (): Promise<MeldekortSystem | undefined> => {
  if (isMock()) return mockAnsvarligMeldekortSystem;
  const url = `${meldekortBackendBaseUrl}/api/ansvarlig-system-felles`;
  try {
    return await fetchProxy<MeldekortSystem>(url, meldekortBackendAudience, 'POST');
  } catch (error) {
    logError('Error fetching ansvarlig meldekortsystem', error);
    return undefined;
  }
};
