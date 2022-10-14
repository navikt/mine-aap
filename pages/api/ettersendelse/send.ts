import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest } from 'lib/auth/accessToken';
import { beskyttetApi } from 'lib/auth/beskyttetApi';
import { tokenXProxy } from 'lib/auth/tokenXProxy';
import { isMock } from 'lib/utils/environments';
import metrics from 'lib/metrics';
import { Ettersendelse } from 'lib/types/types';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = getAccessTokenFromRequest(req);
  await sendEttersendelse(req.body, accessToken);

  const { ettersendteVedlegg }: Ettersendelse = JSON.parse(req.body);
  ettersendteVedlegg.forEach((ettersendelse) => {
    metrics.ettersendVedleggCounter.inc({ type: ettersendelse.vedleggType });
  });

  res.status(201).json({});
});

export const sendEttersendelse = async (data: string, accessToken?: string) => {
  if (isMock()) {
    return {};
  }
  const ettersendelse = await tokenXProxy({
    url: `${process.env.SOKNAD_API_URL}/innsending/ettersend`,
    prometheusPath: '/innsending/ettersend',
    method: 'POST',
    data: data,
    audience: process.env.SOKNAD_API_AUDIENCE!,
    bearerToken: accessToken,
    noResponse: true,
  });
  return ettersendelse;
};

export default handler;
