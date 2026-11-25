import { BodyLong } from '@navikt/ds-react';
import type { BehandlingHendelseNavKontor } from 'lib/types/apiinternTypes';
import { useTranslations } from 'next-intl';
import { StatusTagOgBeskrivelse } from '../../StatusTagOgBeskrivelse/StatusTagOgBeskrivelse';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export interface NavKontorProps {
  steg: HendelseStegProps;
  hendelse: BehandlingHendelseNavKontor;
}
export function NavKontor({ hendelse, steg }: NavKontorProps) {
  const t = useTranslations('statusisak.navKontor');
  return (
    <TidslinjeSteg
      hendelse={hendelse}
      steg={steg}
      title={t(hendelse.progresjon === 'FULLFØRT' ? 'tittel.fullført' : 'tittel.aktivOgIkkePåbegynt')}
    >
      <StatusTagOgBeskrivelse navn={hendelse.navn} status={hendelse.status} />
      <BodyLong>{t('beskrivelse')}</BodyLong>
      <BodyLong weight="semibold">{t('oppfølging')}</BodyLong>
    </TidslinjeSteg>
  );
}
