import * as styles from './NyttigÅVite.module.css';
import { BodyLong, BodyShort, Heading, Link, LinkPanel } from '@navikt/ds-react';
import NextLink from 'next/link';
import { FormattedMessage } from 'react-intl';

export const NyttigÅVite = () => {
  return (
    <>
      <Heading level="2" size="medium" spacing>
        <FormattedMessage id="nyttigÅVite.title" />
      </Heading>
      <div className={styles.container}>
        <div className={styles.linkPanelContainer}>
          <LinkPanel
            target="_blank"
            className={styles.linkPanel}
            href="https://www.nav.no/saksbehandlingstider#arbeidsavklaringspenger-aap"
            border={false}
          >
            <FormattedMessage id="nyttigÅVite.saksbehandlingstider" />
          </LinkPanel>
          <NextLink href="/soknader" passHref legacyBehavior>
            <LinkPanel className={styles.linkPanel} href="#" border={false}>
              <FormattedMessage id="nyttigÅVite.søknader" />
            </LinkPanel>
          </NextLink>
          <LinkPanel className={styles.linkPanel} href="https://www.nav.no/aap#sok" border={false}>
            <FormattedMessage id="forside.søkPåNyttLink" />
          </LinkPanel>
        </div>
        <Heading level="3" size="small">
          <FormattedMessage id="hvaSkjerPanel.heading" />
        </Heading>

        <Heading level="4" size="xsmall">
          <FormattedMessage id="hvaSkjerPanel.punkt1.label" />
        </Heading>
        <BodyLong spacing>
          <FormattedMessage id="hvaSkjerPanel.punkt1.tekst" />
        </BodyLong>

        <Heading level="4" size="xsmall">
          <FormattedMessage id="hvaSkjerPanel.punkt2.label" />
        </Heading>
        <BodyLong spacing>
          <FormattedMessage
            id="hvaSkjerPanel.punkt2.tekst"
            values={{
              a: (chunks) => (
                <Link target="_blank" href="https://klage.nav.no/nb/klage/nav_loven_14a">
                  {chunks}
                </Link>
              ),
            }}
          />
        </BodyLong>

        <Heading level="4" size="xsmall">
          <FormattedMessage id="hvaSkjerPanel.punkt3.label" />
        </Heading>
        <BodyShort>
          <FormattedMessage id="hvaSkjerPanel.punkt3.tekst" />
        </BodyShort>
        <ul>
          <li>
            <BodyShort spacing>
              <FormattedMessage
                id="hvaSkjerPanel.punkt3.punkt1"
                values={{
                  a: (chunks) => (
                    <Link target="_blank" href="https://arbeidsplassen.nav.no/">
                      {chunks}
                    </Link>
                  ),
                }}
              />
            </BodyShort>
          </li>
          <li>
            <BodyShort spacing>
              <FormattedMessage id="hvaSkjerPanel.punkt3.punkt2" />
            </BodyShort>
          </li>

          <li>
            <BodyShort spacing>
              <FormattedMessage id="hvaSkjerPanel.punkt3.punkt3" />
            </BodyShort>
          </li>
        </ul>

        <Heading level="4" size="xsmall">
          <FormattedMessage id="hvaSkjerPanel.punkt4.label" />
        </Heading>
        <BodyLong spacing>
          <FormattedMessage id="hvaSkjerPanel.punkt4.tekst" />
        </BodyLong>

        <Heading level="4" size="xsmall">
          <FormattedMessage id="hvaSkjerPanel.punkt5.label" />
        </Heading>
        <BodyLong spacing>
          <FormattedMessage
            id="hvaSkjerPanel.punkt5.tekst"
            values={{
              a: (chunks) => (
                <Link target="_blank" href={'https://klage.nav.no/nb/klage/arbeidsavklaringspenger'}>
                  {chunks}
                </Link>
              ),
            }}
          />
        </BodyLong>
        <BodyLong spacing>
          <FormattedMessage
            id="hvaSkjerPanel.punkt5.tekst1"
            values={{
              a: (chunks) => (
                <Link target="_blank" href={'https://www.nav.no/skattetrekk'}>
                  {chunks}
                </Link>
              ),
            }}
          />
        </BodyLong>
        <BodyShort spacing>
          <FormattedMessage
            id="hvaSkjerPanel.punkt5.tekst2"
            values={{
              a: (chunks) => (
                <Link target="_blank" href={'https://www.nav.no/klage#arbeidsavklaringspenger-aap'}>
                  {chunks}
                </Link>
              ),
            }}
          />
        </BodyShort>
      </div>
    </>
  );
};
