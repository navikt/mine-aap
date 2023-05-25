import { collectDefaultMetrics, Counter, Histogram } from 'prom-client';
import { logger } from '@navikt/aap-felles-utils';

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
  });

  public ettersendVedleggNumberOfDocumentsHistogram = new Histogram({
    name: 'mine_aap_ettersend_vedlegg_number_of_documents',
    help: 'Total number of documents',
  });

  public webVitalsLcpHistogram = new Histogram({
    name: 'web_vitals_lcp',
    help: 'Largest Contentful Paint',
    labelNames: ['path'],
    buckets: [2500, 4000],
  });

  public webVitalsFcpHistogram = new Histogram({
    name: 'web_vitals_fcp',
    help: 'First Contentful Paint',
    labelNames: ['path'],
    buckets: [100, 300],
  });

  public webVitalsClsHistogram = new Histogram({
    name: 'web_vitals_cls',
    help: 'Cumulative Layout Shift',
    labelNames: ['path'],
    buckets: [0.1, 0.25],
  });

  public webVitalsTtfbHistogram = new Histogram({
    name: 'web_vitals_ttfb',
    help: 'Time to First Byte',
    labelNames: ['path'],
    buckets: [800, 1800],
  });
}

global._metrics = global._metrics || new AppMetrics();

export default global._metrics;
