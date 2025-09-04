'use client';

// Må ha denne som en klient-komponent da i18n-link ikke funker sammen med ssr på LinkCard

import { LinkCard } from '@navikt/ds-react';
import { Link as NextLink } from 'i18n/routing';
import { useTranslations } from 'next-intl';

export const SøknaderClientLenke = () => {
  const t = useTranslations('nyttigÅVite');

  return (
    <LinkCard>
      <LinkCard.Title>
        <LinkCard.Anchor asChild>
          <NextLink href="/soknader" passHref legacyBehavior>
            {t('søknader')}
          </NextLink>
        </LinkCard.Anchor>
      </LinkCard.Title>
    </LinkCard>
  );
};
