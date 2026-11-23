import { BodyLong } from '@navikt/ds-react';
import type { BehandlingHendelseSoknadMottatt } from 'lib/types/apiinternTypes';
import { useTranslations } from 'next-intl';
import { StatusTagOgBeskrivelse } from '../../StatusTagOgBeskrivelse/StatusTagOgBeskrivelse';
import { TidslinjeSteg } from '../TidslinjeSteg';
import type { HendelseStegProps } from '../types';

export interface SoknadMottattProps {
  steg: HendelseStegProps;
  hendelse: BehandlingHendelseSoknadMottatt;
}
export function SoknadMottatt(props: SoknadMottattProps) {
  const t = useTranslations('statusisak.soknadMottatt');

  return (
    <TidslinjeSteg {...props} title="Søknaden din er mottatt">
      <StatusTagOgBeskrivelse navn={props.hendelse.navn} />
      <BodyLong>{t('beskrivelse')}</BodyLong>
    </TidslinjeSteg>
  );
}
