import { NextApiRequest, NextApiResponse } from 'next';
import {
  logger,
  isMock,
  beskyttetApi,
  getAccessTokenFromRequest,
  tokenXApiProxy,
} from '@navikt/aap-felles-innbygger-utils';
import metrics from 'lib/metrics';
import { Ettersendelse, EttersendelseBackendState } from 'lib/types/types';
import { tokenXProxy } from '../../../lib/api/tokenXProxy';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const { ettersendteVedlegg, søknadId, totalFileSize }: Ettersendelse = JSON.parse(req.body);

  //TODO: Tror jeg kan fjerne de neste 2(5)(til og med linje 21) linjene
  const body: EttersendelseBackendState = {
    ...(søknadId && { søknadId: søknadId }),
    ettersendteVedlegg,
  };
  req.body = JSON.stringify(body);

  await sendEttersendelse(req, res);

  ettersendteVedlegg.forEach((ettersendelse) => {
    logger.info(`lager metrics for ettersendelse.${ettersendelse.vedleggType}`);
    metrics.ettersendVedleggCounter.inc({ type: ettersendelse.vedleggType });

    metrics.ettersendVedleggSizeHistogram.observe(totalFileSize);
    metrics.ettersendVedleggNumberOfDocumentsHistogram.observe(ettersendelse.ettersending.length);
  });

  res.status(201).json({});
});

export const sendEttersendelse = async (req: NextApiRequest, res: NextApiResponse) => {
  if (isMock()) {
    return {};
  }
  return await tokenXProxy(req, res, `/innsending/ettersend`, '/innsending/ettersend');
};

export default handler;
