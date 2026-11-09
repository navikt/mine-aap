import { BodyLong } from '@navikt/ds-react';
import { beskrivelser, navKontorTekst } from '../../tidslinjeMapping';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export function NavKontor(props: HendelseStegProps) {
  return (
    <TidslinjeSteg {...props} title={navKontorTekst.tittel}>
      <BodyLong>{beskrivelser.NAV_KONTOR}</BodyLong>
      <BodyLong>
        {navKontorTekst.varighet} <strong>{navKontorTekst.oppfølging}</strong>
      </BodyLong>
    </TidslinjeSteg>
  );
}
