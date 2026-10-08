import { Heading } from '@navikt/ds-react';
import { LinkCard, LinkCardAnchor, LinkCardTitle } from '@navikt/ds-react/LinkCard';
import { MottattSoknad } from 'components/NyttigÅVite/MottattSoknad';
import { SøknaderClientLenke } from 'components/NyttigÅVite/SøknaderClientLenke';
import { getTranslations } from 'next-intl/server';
import styles from './NyttigÅVite.module.css';

export const NyttigÅViteServer = async () => {
  const t = await getTranslations('');
  return (
    <>
      <Heading level="2" size="medium" spacing>
        {t('nyttigÅVite.title')}
      </Heading>
      <div className={styles.container}>
        <div className={styles.linkPanelContainer}>
          <LinkCard>
            <LinkCardTitle>
              <LinkCardAnchor
                href="https://www.nav.no/saksbehandlingstider#arbeidsavklaringspenger-aap"
                target="_blank"
              >
                {t('nyttigÅVite.saksbehandlingstider')}
              </LinkCardAnchor>
            </LinkCardTitle>
          </LinkCard>
          <SøknaderClientLenke />
          <LinkCard>
            <LinkCardTitle>
              <LinkCardAnchor href="https://www.nav.no/aap#sok" target="_blank">
                {t('forside.søkPåNyttLink')}
              </LinkCardAnchor>
            </LinkCardTitle>
          </LinkCard>
          <MottattSoknad />
        </div>
      </div>
    </>
  );
};
