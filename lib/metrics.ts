import { collectDefaultMetrics, Counter, Histogram } from 'prom-client';
import logger from './utils/logger';

declare global {
  var _metrics: AppMetrics;
}

export class AppMetrics {
  constructor() {
    logger.info('Initializing metrics client');
    collectDefaultMetrics();
  }

  public backendApiDurationHistogram = new Histogram({
    name: 'mine_aap_requests_duration_seconds',
    help: 'Load time for API call to soknad-api-backend',
    labelNames: ['path'],
  });

  public getServersidePropsDurationHistogram = new Histogram({
    name: 'mine_aap_get_serverside_props_duration_seconds',
    help: 'Load time for getServerSideProps',
    labelNames: ['path'],
  });
}

global._metrics = global._metrics || new AppMetrics();

export default global._metrics;
