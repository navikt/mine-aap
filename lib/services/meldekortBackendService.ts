import { MeldekortSystem } from 'lib/types/types';
import { isMock } from 'lib/utils/environments';
import { fetchProxy } from 'lib/services/fetchProxy';
import { mockAnsvarligMeldekortSystem } from 'lib/mock/mockAnsvarligMeldekortSystem';
import { logError } from 'lib/server/logger';

const meldekortBackendBaseUrl = process.env.MELDEKORT_BACKEND_URL;
const meldekortBackendAudience = process.env.MELDEKORT_BACKEND_AUDIENCE ?? '';

export const hentAnsvarligMeldekortsystem = async (): Promise<
  MeldekortSystem | undefined
> => {
  if (isMock()) return mockAnsvarligMeldekortSystem;
  const url = `${meldekortBackendBaseUrl}/api/ansvarlig-system-felles`;
  try {
    return await fetchProxy<MeldekortSystem>(
      url,
      meldekortBackendAudience,
      'GET',
    );
  } catch (error) {
    logError('Error fetching ansvarlig meldekortsystem', error);
    return undefined;
  }
};
