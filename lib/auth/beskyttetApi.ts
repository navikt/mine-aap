import { NextApiRequest, NextApiResponse } from 'next';
import { isMock } from 'lib/utils/environments';
import { logger } from '@navikt/aap-felles-innbygger-utils';
import { ErrorMedStatus } from 'lib/auth/ErrorMedStatus';
import { verifyIdportenAccessToken } from 'lib/auth/verifyIdPortenAccessToken';

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>;

export function beskyttetApi(handler: ApiHandler): ApiHandler {
  return async function withBearerTokenHandler(req, res) {
    function send401() {
      return res.status(401).json({ message: 'Access denied' });
    }
    function send500() {
      return res.status(500).json({ message: 'NextJS internal server error' });
    }

    try {
      if (isMock()) {
        logger.warn('handling request for mocked environment, should not happen in production');
        return handler(req, res);
      }

      const bearerToken: string | null | undefined = req.headers['authorization'];
      if (!bearerToken) {
        logger.error('ingen bearer token');
        return send401();
      }
      try {
        await verifyIdportenAccessToken(bearerToken);
      } catch (e) {
        logger.error('kunne ikke validere idportentoken i beskyttetApi', e);
        return send401();
      }
      return handler(req, res);
    } catch (e) {
      logger.error(e);
      logger.info('handling error in beskyttetApi');
      if (e instanceof ErrorMedStatus) {
        logger.info(`sending error with status ${e.status} and message ${e.message}`);
        return res.status(e.status).json({ message: e.message });
      }
      return send500();
    }
  };
}
