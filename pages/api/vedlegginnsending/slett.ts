import { beskyttetApi, isMock, logError } from '@navikt/aap-felles-utils';
import { simpleTokenXProxy } from 'lib/api/simpleTokenXProxy';
import { NextApiRequest } from 'next';

const handler = beskyttetApi(async (req, res) => {
  const uuid = req.query.uuid;
  if (!uuid || Array.isArray(uuid)) {
    res.status(400).json({ error: 'uuid må være en string' });
    return;
  }
  return await slettVedleggInnsending(uuid, req);
});

export const slettVedleggInnsending = async (uuid: string, req: NextApiRequest) => {
  if (isMock()) return;

  try {
    const response = await simpleTokenXProxy({
      url: `${process.env.INNSENDING_URL}/mellomlagring/fil/${uuid}`,
      audience: process.env.INNSENDING_AUDIENCE!,
      method: 'DELETE',
      req,
    });
    return response;
  } catch (error) {
    logError('Error sending slettVedleggInnsending', error);
    throw new Error('Error sending slettVedleggInnsending');
  }
};

export default handler;
