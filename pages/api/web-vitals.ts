import { logger } from '@navikt/aap-felles-innbygger-utils';
import metrics from 'lib/metrics';
import { WebVital } from 'lib/types/webWital';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const webVital: WebVital = JSON.parse(req.body);
  if (webVital?.label === 'web-vital') {
    switch (webVital?.name) {
      case 'FCP':
        metrics.webVitalsFcpHistogram.observe({ path: webVital.path }, webVital.value);
        break;
      case 'LCP':
        metrics.webVitalsLcpHistogram.observe({ path: webVital.path }, webVital.value);
        break;
      case 'CLS':
        metrics.webVitalsClsHistogram.observe({ path: webVital.path }, webVital.value);
        break;
      case 'TTFB':
        metrics.webVitalsTtfbHistogram.observe({ path: webVital.path }, webVital.value);
        break;
      default:
        logger.info(`unknown web-vital with name ${webVital.name}`);
        break;
    }
  }
  res.status(200).json({});
};

export default handler;
