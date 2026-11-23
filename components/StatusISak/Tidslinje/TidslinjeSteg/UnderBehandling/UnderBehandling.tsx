import { BodyLong } from '@navikt/ds-react';
import type { BehandlingHendelseNay } from 'lib/types/apiinternTypes';
import { useTranslations } from 'next-intl';
import { StatusTagOgBeskrivelse } from '../../StatusTagOgBeskrivelse/StatusTagOgBeskrivelse';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export interface UnderBehandlingProps {
  steg: HendelseStegProps;
  hendelse: BehandlingHendelseNay;
}
export function UnderBehandling({ hendelse, steg }: UnderBehandlingProps) {
  const t = useTranslations('statusisak.underBehandling');

  /*const beskrivelse =
    hendelse.status && hendelse.progresjon !== 'IKKE_PÅBEGYNT'
      ? venteStatusTekstNay()[hendelse.status]
      : beskrivelser().NAY;
  */

  //TODO: Status for "Søknaden står i kø"

  return (
    <TidslinjeSteg steg={steg} hendelse={hendelse} title={t('tittel')}>
      <StatusTagOgBeskrivelse navn={hendelse.navn} status={hendelse.status} />
      <BodyLong>{t('beskrivelse')}</BodyLong>
      <BodyLong weight="semibold">{t('oppfølging')}</BodyLong>
    </TidslinjeSteg>
  );
}
