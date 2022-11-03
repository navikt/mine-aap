import { collectDefaultMetrics, Counter, Histogram } from 'prom-client';
import { logger } from '@navikt/aap-felles-innbygger-utils';

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

  public backendApiStatusCodeCounter = new Counter({
    name: 'mine_aap_requests_status_code',
    help: 'Status code for API call to soknad-api-backend',
    labelNames: ['path', 'status'],
  });

  public getServersidePropsDurationHistogram = new Histogram({
    name: 'mine_aap_get_serverside_props_duration_seconds',
    help: 'Load time for getServerSideProps',
    labelNames: ['path'],
  });

  public ettersendVedleggCounter = new Counter({
    name: 'mine_aap_ettersend_vedlegg',
    help: 'Ettersendte vedlegg til søknad gruppert på type',
    labelNames: ['type'],
  });

  public ettersendVedleggSizeHistogram = new Histogram({
    name: 'mine_aap_ettersend_vedlegg_size',
    help: 'Total size of documents',
    labelNames: [''],
  });

  public ettersendVedleggNumberOfDocumentsHistogram = new Histogram({
    name: 'mine_aap_ettersend_vedlegg_number_of_documents',
    help: 'Total number of documents',
    labelNames: [''],
  });
}

global._metrics = global._metrics || new AppMetrics();

export default global._metrics;
