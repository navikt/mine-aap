'use client';
import { BodyLong } from '@navikt/ds-react';
import type { BehandlingHendelseNavKontor } from 'lib/types/apiinternTypes';
import { useTranslations } from 'next-intl';
import { beskrivelser } from '../../tidslinjeMapping';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export interface NavKontorProps {
  steg: HendelseStegProps;
  hendelse: BehandlingHendelseNavKontor;
}
export function NavKontor({ hendelse, steg }: NavKontorProps) {
  const t = useTranslations('statusisak.navKontor');
  return (
    <TidslinjeSteg hendelse={hendelse} steg={steg} title={t('tittel')}>
      <BodyLong>{beskrivelser().NAV_KONTOR}</BodyLong>
      <BodyLong>
        {t('varighet')} <strong>{t('oppfølging')}</strong>
      </BodyLong>
    </TidslinjeSteg>
  );
}
