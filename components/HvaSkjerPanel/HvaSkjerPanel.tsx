import { BodyLong, BodyShort, Heading, Label, Link, Panel } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './HvaSkjerPanel.module.css';

export const HvaSkjerPanel = () => {
  return (
    <Panel className={styles.panel}>
      <Heading level="2" size="medium" spacing>
        <FormattedMessage id="hvaSkjerPanel.heading" />
      </Heading>
      <ul>
        <li>
          <Label as={'p'}>
            <FormattedMessage id="hvaSkjerPanel.punkt1.label" />
          </Label>
          <BodyLong spacing>
            <FormattedMessage id="hvaSkjerPanel.punkt1.tekst" />
          </BodyLong>
        </li>
        <li>
          <Label as={'p'}>
            <FormattedMessage id="hvaSkjerPanel.punkt2.label" />
          </Label>
          <BodyLong spacing>
            <FormattedMessage
              id="hvaSkjerPanel.punkt2.tekst"
              values={{
                a: (chunks) => (
                  <Link target="_blank" href="https://klage.nav.no/nb/arbeid/nav-loven-14a">
                    {chunks}
                  </Link>
                ),
              }}
            />
          </BodyLong>
        </li>
        <li>
          <Label as={'p'}>
            <FormattedMessage id="hvaSkjerPanel.punkt3.label" />
          </Label>
          <BodyShort spacing>
            <FormattedMessage id="hvaSkjerPanel.punkt3.tekst" />
          </BodyShort>
          <ul>
            <li>
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
            </li>
            <li>
              <FormattedMessage id="hvaSkjerPanel.punkt3.punkt2" />
            </li>
            <li>
              <FormattedMessage id="hvaSkjerPanel.punkt3.punkt3" />
            </li>
          </ul>
        </li>
        <li>
          <Label as={'p'}>
            <FormattedMessage id="hvaSkjerPanel.punkt4.label" />
          </Label>
          <BodyLong spacing>
            <FormattedMessage id="hvaSkjerPanel.punkt4.tekst" />
          </BodyLong>
        </li>
        <li>
          <Label as={'p'}>
            <FormattedMessage id="hvaSkjerPanel.punkt5.label" />
          </Label>
          <BodyLong spacing>
            <FormattedMessage
              id="hvaSkjerPanel.punkt5.tekst"
              values={{
                a: (chunks) => (
                  <Link
                    target="_blank"
                    href={
                      'https://www.nav.no/soknader/nb/person/arbeid/arbeidsavklaringspenger/NAV%2011-13.05/klage-eller-anke/brev'
                    }
                  >
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
          <BodyLong spacing>
            <FormattedMessage id="hvaSkjerPanel.punkt5.tekst2" />
          </BodyLong>
        </li>
      </ul>
    </Panel>
  );
};
