import { BodyLong } from '@navikt/ds-react';
import { beskrivelser } from '../../tidslinjeMapping';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export function SoknadMottatt(props: HendelseStegProps) {
  return (
    <TidslinjeSteg {...props} title="Søknaden din er mottatt">
      <BodyLong>{beskrivelser.SØKNAD_MOTTATT}</BodyLong>
    </TidslinjeSteg>
  );
}
