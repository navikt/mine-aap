import { BodyLong } from '@navikt/ds-react';
import type { BehandlingHendelseNay } from 'lib/types/apiinternTypes';
import { beskrivelser, venteStatusTekstNay } from '../../tidslinjeMapping';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export interface UnderBehandlingProps {
  steg: HendelseStegProps;
  hendelse: BehandlingHendelseNay;
}
export function UnderBehandling({ hendelse, steg }: UnderBehandlingProps) {
  const beskrivelse =
    hendelse.status && hendelse.progresjon !== 'IKKE_PÅBEGYNT'
      ? venteStatusTekstNay()[hendelse.status]
      : beskrivelser().NAY;

  return (
    <TidslinjeSteg steg={steg} hendelse={hendelse} title="Vi behandler siste del av søknaden din">
      <BodyLong>{beskrivelse}</BodyLong>
    </TidslinjeSteg>
  );
}
