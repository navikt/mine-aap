import { BodyLong } from '@navikt/ds-react';
import type { BehandlingHendelseAlderLovvalg } from 'lib/types/apiinternTypes';
import { beskrivelser, venteStatusTekstAlderLovvalgMedlemskap } from '../../tidslinjeMapping';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export interface AlderLovvalgProps {
  steg: HendelseStegProps;
  hendelse: BehandlingHendelseAlderLovvalg;
}
export function AlderLovvalgMedlemskap({ hendelse, steg }: AlderLovvalgProps) {
  const title = hendelse.progresjon === 'FULLFØRT' ? 'Vi har sjekket søknaden din' : 'Vi sjekker søknaden din';
  const beskrivelse =
    hendelse.status && hendelse.progresjon !== 'IKKE_PÅBEGYNT'
      ? venteStatusTekstAlderLovvalgMedlemskap()[hendelse.status]
      : beskrivelser().ALDER_LOVVALG_MEDLEMSKAP;

  return (
    <TidslinjeSteg steg={steg} hendelse={hendelse} title={title}>
      <BodyLong>{beskrivelse}</BodyLong>
    </TidslinjeSteg>
  );
}
