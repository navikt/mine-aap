'use client';
// TODO ssr

import { TasklistIcon } from '@navikt/aksel-icons';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { Heading, LinkCard } from '@navikt/ds-react';
import { useTranslations } from 'next-intl';

import styles from './Meldekortlenke.module.css';

export const Meldekortlenke = () => {
  const t = useTranslations('forside.meldekort');

  return (
    <PageComponentFlexContainer>
      <Heading level="2" size="medium" spacing>
        {t('heading')}
      </Heading>
      <LinkCard className={styles.container}>
        <LinkCard.Icon>
          <TasklistIcon title="a11y-title" fontSize="1.5rem" />
        </LinkCard.Icon>
        <LinkCard.Title>
          <LinkCard.Anchor href={'https://www.nav.no/aap/meldekort/'}>{t('tekst')}</LinkCard.Anchor>
        </LinkCard.Title>
      </LinkCard>
    </PageComponentFlexContainer>
  );
};
