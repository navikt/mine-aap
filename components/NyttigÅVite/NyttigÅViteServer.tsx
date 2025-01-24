import styles from './NyttigÅVite.module.css';
import { BodyLong, BodyShort, Heading, Link, LinkPanel } from '@navikt/ds-react';
import { getTranslations } from 'next-intl/server';
import { Link as NextLink } from 'i18n/routing';

export const NyttigÅViteServer = async () => {
  const t = await getTranslations('');
  return (
    <>
      <Heading level="2" size="medium" spacing>
        {t('nyttigÅVite.title')}
      </Heading>
      <div className={styles.container}>
        <div className={styles.linkPanelContainer}>
          <LinkPanel
            target="_blank"
            className={styles.linkPanel}
            href="https://www.nav.no/saksbehandlingstider#arbeidsavklaringspenger-aap"
            border={false}
          >
            {t('nyttigÅVite.saksbehandlingstider')}
          </LinkPanel>
          <NextLink href="/soknader" passHref legacyBehavior>
            <LinkPanel className={styles.linkPanel} href="#" border={false}>
              {t('nyttigÅVite.søknader')}
            </LinkPanel>
          </NextLink>
          <LinkPanel className={styles.linkPanel} href="https://www.nav.no/aap#sok" border={false}>
            {t('forside.søkPåNyttLink')}
          </LinkPanel>
        </div>
        <Heading level="3" size="small">
          {t('hvaSkjerPanel.heading')}
        </Heading>

        <Heading level="4" size="xsmall">
          {t('hvaSkjerPanel.punkt1.label')}
        </Heading>
        <BodyLong spacing>{t('hvaSkjerPanel.punkt1.tekst')}</BodyLong>

        <Heading level="4" size="xsmall">
          {t('hvaSkjerPanel.punkt2.label')}
        </Heading>
        <BodyLong spacing>
          {t('hvaSkjerPanel.punkt2.tekstForLenke')}
          <Link target="_blank" href="https://klage.nav.no/nb/klage/nav_loven_14a">
            {t('hvaSkjerPanel.punkt2.tekstLenkeTekst')}
          </Link>
          {t('hvaSkjerPanel.punkt2.tekstEtterLenke')}
        </BodyLong>

        <Heading level="4" size="xsmall">
          {t('hvaSkjerPanel.punkt3.label')}
        </Heading>
        <BodyShort>{t('hvaSkjerPanel.punkt3.tekst')}</BodyShort>
        <ul>
          <li>
            <BodyShort spacing>
              {t('hvaSkjerPanel.punkt3.punkt1ForLenke')}
              <Link target="_blank" href="https://arbeidsplassen.nav.no/">
                {t('hvaSkjerPanel.punkt3.punkt1LenkeTekst')}
              </Link>
            </BodyShort>
          </li>
          <li>
            <BodyShort spacing>{t('hvaSkjerPanel.punkt3.punkt2')}</BodyShort>
          </li>

          <li>
            <BodyShort spacing>{t('hvaSkjerPanel.punkt3.punkt3')}</BodyShort>
          </li>
        </ul>

        <Heading level="4" size="xsmall">
          {t('hvaSkjerPanel.punkt4.label')}
        </Heading>
        <BodyLong spacing>{t('hvaSkjerPanel.punkt4.tekst')}</BodyLong>

        <Heading level="4" size="xsmall">
          {t('hvaSkjerPanel.punkt5.label')}
        </Heading>
        <BodyLong spacing>
          {t('hvaSkjerPanel.punkt5.tekstForLenke')}
          <Link target="_blank" href={'https://klage.nav.no/nb/klage/arbeidsavklaringspenger'}>
            {t('hvaSkjerPanel.punkt5.tekstLenkeTekst')}
          </Link>
          {t('hvaSkjerPanel.punkt5.tekstEtterLenke')}
        </BodyLong>
        <BodyLong spacing>
          {t('hvaSkjerPanel.punkt5.tekst1ForLenke')}

          <Link target="_blank" href={'https://www.nav.no/skattetrekk'}>
            {t('hvaSkjerPanel.punkt5.tekst1LenkeTekst')}
          </Link>
        </BodyLong>
        <BodyShort spacing>
          {t('hvaSkjerPanel.punkt5.tekst2ForLenke')}

          <Link target="_blank" href={'https://www.nav.no/klage#arbeidsavklaringspenger-aap'}>
            {t('hvaSkjerPanel.punkt5.tekst2LenkeTekst')}
          </Link>
        </BodyShort>
      </div>
    </>
  );
};
