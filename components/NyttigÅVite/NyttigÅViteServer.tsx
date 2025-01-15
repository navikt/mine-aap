import styles from './NyttigÅVite.module.css';
import { BodyLong, BodyShort, Heading, Link, LinkPanel } from '@navikt/ds-react';
import { getDictionary } from 'app/dev/[lang]/dictionaries';
import NextLink from 'next/link';

export const NyttigÅViteServer = async () => {
  //const lang = (await params).lang;
  const dict = await getDictionary('nb');
  return (
    <>
      <Heading level="2" size="medium" spacing>
        {dict.nyttigÅVite.title}
      </Heading>
      <div className={styles.container}>
        <div className={styles.linkPanelContainer}>
          <LinkPanel
            target="_blank"
            className={styles.linkPanel}
            href="https://www.nav.no/saksbehandlingstider#arbeidsavklaringspenger-aap"
            border={false}
          >
            {dict.nyttigÅVite.saksbehandlingstider}
          </LinkPanel>
          <NextLink href="/soknader" passHref legacyBehavior>
            <LinkPanel className={styles.linkPanel} href="#" border={false}>
              {dict.nyttigÅVite.søknader}
            </LinkPanel>
          </NextLink>
          <LinkPanel className={styles.linkPanel} href="https://www.nav.no/aap#sok" border={false}>
            {dict.forside.søkPåNyttLink}
          </LinkPanel>
        </div>
        <Heading level="3" size="small">
          {dict.hvaSkjerPanel.heading}
        </Heading>

        <Heading level="4" size="xsmall">
          {dict.hvaSkjerPanel.punkt1.label}
        </Heading>
        <BodyLong spacing>{dict.hvaSkjerPanel.punkt1.tekst}</BodyLong>

        <Heading level="4" size="xsmall">
          {dict.hvaSkjerPanel.punkt2.label}
        </Heading>
        <BodyLong spacing>
          {dict.hvaSkjerPanel.punkt2.tekstForLenke}
          <Link target="_blank" href="https://klage.nav.no/nb/klage/nav_loven_14a">
            {dict.hvaSkjerPanel.punkt2.tekstLenkeTekst}
          </Link>
          {dict.hvaSkjerPanel.punkt2.tekstEtterLenke}
        </BodyLong>

        <Heading level="4" size="xsmall">
          {dict.hvaSkjerPanel.punkt3.label}
        </Heading>
        <BodyShort>{dict.hvaSkjerPanel.punkt3.tekst}</BodyShort>
        <ul>
          <li>
            <BodyShort spacing>
              {dict.hvaSkjerPanel.punkt3.punkt1ForLenke}
              <Link target="_blank" href="https://arbeidsplassen.nav.no/">
                {dict.hvaSkjerPanel.punkt3.punkt1LenkeTekst}
              </Link>
            </BodyShort>
          </li>
          <li>
            <BodyShort spacing>{dict.hvaSkjerPanel.punkt3.punkt2}</BodyShort>
          </li>

          <li>
            <BodyShort spacing>{dict.hvaSkjerPanel.punkt3.punkt3}</BodyShort>
          </li>
        </ul>

        <Heading level="4" size="xsmall">
          {dict.hvaSkjerPanel.punkt4.label}
        </Heading>
        <BodyLong spacing>{dict.hvaSkjerPanel.punkt4.tekst}</BodyLong>

        <Heading level="4" size="xsmall">
          {dict.hvaSkjerPanel.punkt5.label}
        </Heading>
        <BodyLong spacing>
          {dict.hvaSkjerPanel.punkt5.tekstForLenke}
          <Link target="_blank" href={'https://klage.nav.no/nb/klage/arbeidsavklaringspenger'}>
            {dict.hvaSkjerPanel.punkt5.tekstLenkeTekst}
          </Link>
          {dict.hvaSkjerPanel.punkt5.tekstEtterLenke}
        </BodyLong>
        <BodyLong spacing>
          {dict.hvaSkjerPanel.punkt5.tekst1ForLenke}

          <Link target="_blank" href={'https://www.nav.no/skattetrekk'}>
            {dict.hvaSkjerPanel.punkt5.tekst1LenkeTekst}
          </Link>
        </BodyLong>
        <BodyShort spacing>
          {dict.hvaSkjerPanel.punkt5.tekst2ForLenke}

          <Link target="_blank" href={'https://www.nav.no/klage#arbeidsavklaringspenger-aap'}>
            {dict.hvaSkjerPanel.punkt5.tekst2LenkeTekst}
          </Link>
        </BodyShort>
      </div>
    </>
  );
};
