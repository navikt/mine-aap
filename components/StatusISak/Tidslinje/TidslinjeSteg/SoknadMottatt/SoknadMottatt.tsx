import { BodyLong } from '@navikt/ds-react';
import type { BehandlingHendelseSoknadMottatt } from 'lib/types/apiinternTypes';
import { beskrivelser } from '../../tidslinjeMapping';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export interface SoknadMottattProps {
  steg: HendelseStegProps;
  hendelse: BehandlingHendelseSoknadMottatt;
}
export function SoknadMottatt(props: SoknadMottattProps) {
  return (
    <TidslinjeSteg {...props} title="Søknaden din er mottatt">
      <BodyLong>{beskrivelser().SØKNAD_MOTTATT}</BodyLong>
    </TidslinjeSteg>
  );
}
