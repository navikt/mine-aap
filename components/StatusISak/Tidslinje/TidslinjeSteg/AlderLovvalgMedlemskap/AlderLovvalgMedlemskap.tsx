import { BodyLong } from '@navikt/ds-react';
import type { BehandlingHendelseAlderLovvalgMedlemskap } from 'lib/types/apiinternTypes';
import { useTranslations } from 'next-intl';
import { StatusTagOgBeskrivelse } from '../../StatusTagOgBeskrivelse/StatusTagOgBeskrivelse';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export interface AlderLovvalgMedlemskapsProps {
  steg: HendelseStegProps;
  hendelse: BehandlingHendelseAlderLovvalgMedlemskap;
}
export function AlderLovvalgMedlemskap({ hendelse, steg }: AlderLovvalgMedlemskapsProps) {
  const t = useTranslations('statusisak.alderLovvalgMedlemskap');

  return (
    <TidslinjeSteg
      steg={steg}
      hendelse={hendelse}
      title={t(hendelse.progresjon === 'FULLFØRT' ? 'tittel.fullført' : 'tittel.aktivOgIkkePåbegynt')}
    >
      <StatusTagOgBeskrivelse navn={hendelse.navn} status={hendelse.status} />
      <BodyLong>{t('beskrivelse')}</BodyLong>
      <BodyLong weight="semibold">{t('oppfølging')}</BodyLong>
    </TidslinjeSteg>
  );
}
