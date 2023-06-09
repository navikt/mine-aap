import {
  logger,
  tokenXApiProxy,
  beskyttetApi,
  getAccessTokenFromRequest,
} from '@navikt/aap-felles-utils';
import metrics from 'lib/metrics';
import { Dokument } from 'lib/types/types';

export interface SafResponse {
  data: {
    dokumentoversiktSelvbetjening: {
      journalposter: [
        {
          journalpostId: string;
          journalposttype: 'I' | 'U' | 'N';
          journalstatus: string;
          relevanteDatoer: [
            {
              dato: string;
              datoType: string;
            }
          ];
          tittel: string;
          dokumenter: [
            {
              tittel: string;
              dokumentInfoId: string;
            }
          ];
        }
      ];
    };
  };
}

export const mapSafResponseToDokumenter = (safResponse: SafResponse): Dokument[] => {
  const dokumenter: Dokument[] = [];
  safResponse.data.dokumentoversiktSelvbetjening.journalposter.forEach((journalpost) => {
    journalpost.dokumenter.forEach((dokument) => {
      dokumenter.push({
        tittel: dokument.tittel,
        dokumentId: dokument.dokumentInfoId,
        journalpostId: journalpost.journalpostId,
        type: journalpost.journalposttype,
        dato:
          journalpost.relevanteDatoer.find((dato) => dato.datoType === 'DATO_REGISTRERT')?.dato ??
          '',
        innsendingsId: '',
      });
    });
  });
  return dokumenter;
};

const handler = beskyttetApi(async (req, res) => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT != 'dev') {
    return res.status(404).json({ message: 'Not found' });
  }
  const accessToken = getAccessTokenFromRequest(req);
  const safResponse = await getDocuments(accessToken);
  const dokumenter = mapSafResponseToDokumenter(safResponse);
  res.status(200).json(dokumenter);
});

export const getDocuments = async (accessToken?: string): Promise<SafResponse> => {
  //if (isMock()) return mockDokumenter;
  return await tokenXApiProxy({
    url: `${process.env.DOKUMENTER_URL}/api/dokumenter`,
    prometheusPath: '/api/dokumenter',
    method: 'GET',
    audience: process.env.DOKUMENTER_AUDIENCE!,
    bearerToken: accessToken,
    logger: logger,
    metricsStatusCodeCounter: metrics.backendApiStatusCodeCounter,
    metricsTimer: metrics.backendApiDurationHistogram,
  });
};

export default handler;
