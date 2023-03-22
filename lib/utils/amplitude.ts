import { logAmplitudeEvent as dekoratorenLogEvent } from '@navikt/nav-dekoratoren-moduler';

export const logAmplitudeEvent = (eventName: string, eventData?: Record<string, any>) => {
  dekoratorenLogEvent({ origin: 'aap-innsyn', eventName, eventData }).catch((e) => {
    console.log('Amplitude error', e);
  });
};

export function logLastOppFilEvent(opplastingsType: string) {
  logAmplitudeEvent('last opp fil', { opplastingsType });
}

export function logDokumentoversiktEvent(antallSider: number, interaksjonsType: string) {
  logAmplitudeEvent('interaksjon med dokumentoversikt', { antallSider, interaksjonsType });
}
