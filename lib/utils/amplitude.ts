import { init, track } from '@amplitude/analytics-browser';

export const initAmplitude = () => {
  init('default', undefined, {
    useBatch: true,
    serverUrl: 'https://amplitude.nav.no/collect-auto',
    ingestionMetadata: {
      sourceName: window.location.toString(),
    },
  });
};

export const logAmplitudeEvent = (event: string, properties?: Record<string, any>) => {
  track(event, properties);
};

export function logLastOppFilEvent(opplastingsType: string) {
  logAmplitudeEvent('last opp fil', { opplastingsType });
}
