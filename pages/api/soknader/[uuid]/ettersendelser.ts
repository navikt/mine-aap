import { beskyttetApi, isMock } from '@navikt/aap-felles-utils';
import { getStringFromPossiblyArrayQuery } from '@navikt/aap-felles-utils-client';
import { mockEttersendelserSoknad } from 'lib/mock/mockSoknad';
import { MineAapSoknadMedEttersendinger } from 'lib/types/types';
import { simpleTokenXProxy } from 'lib/api/simpleTokenXProxy';
import { IncomingMessage } from 'http';

const handler = beskyttetApi(async (req, res) => {
  const uuid = getStringFromPossiblyArrayQuery(req.query.uuid);
  if (!uuid) {
    res.status(400).json({ error: 'uuid må være en string' });
    return;
  }
  const ettersendelse = await getEttersendelserForSøknad(uuid, req);
  res.status(200).json(ettersendelse);
});

export const getEttersendelserForSøknad = async (
  uuid: string,
  req?: IncomingMessage
): Promise<MineAapSoknadMedEttersendinger> => {
  if (isMock()) return mockEttersendelserSoknad;
  const ettersendelse: MineAapSoknadMedEttersendinger = await simpleTokenXProxy({
    url: `${process.env.INNSENDING_URL}/innsending/søknader/${uuid}/ettersendinger`,
    audience: process.env.INNSENDING_AUDIENCE || '',
    req,
  });
  return ettersendelse;
};

export default handler;
