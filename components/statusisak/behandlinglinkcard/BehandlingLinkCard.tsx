'use client';

import { LinkCard } from '@navikt/ds-react/LinkCard';
import { Link } from 'i18n/routing';
import type { Behandling } from 'lib/services/apiInternService';

interface Props {
  behandling: Behandling;
}
export const BehandlingLinkCard = ({ behandling }: Props) => {
  return (
    <LinkCard key={behandling.behandlingId}>
      <LinkCard.Title>
        <LinkCard.Anchor asChild>
          <Link href={`/sis/${behandling.behandlingId}`}>{behandling.behandlingType}</Link>
        </LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description>{`Opprettet ${behandling.opprettet}`}</LinkCard.Description>
    </LinkCard>
  );
};
