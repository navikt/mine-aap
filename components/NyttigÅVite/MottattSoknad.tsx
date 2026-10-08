'use client';

import { Accordion, BodyLong, BodyShort, Heading, Link } from '@navikt/ds-react';
import { useTranslations } from 'next-intl';

export const MottattSoknad = () => {
  const t = useTranslations('');
  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>{t('hvaSkjerPanel.heading')}</Accordion.Header>
        <Accordion.Content>
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
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};
