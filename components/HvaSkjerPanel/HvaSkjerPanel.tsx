import { Panel, Heading, Label, BodyLong, BodyShort, Link } from '@navikt/ds-react';
import styles from './HvaSkjerPanel.module.css';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';

export const HvaSkjerPanel = () => {
  const { formatMessage, formatElement } = useFeatureToggleIntl();
  return (
    <Panel className={styles.panel}>
      <Heading level="2" size="medium" spacing>
        {formatMessage('hvaSkjerPanel.heading')}
      </Heading>
      <ul>
        <li>
          <Label as={'p'}>{formatMessage('hvaSkjerPanel.punkt1.label')}</Label>
          <BodyLong spacing>{formatMessage('hvaSkjerPanel.punkt1.tekst')}</BodyLong>
        </li>
        <li>
          <Label as={'p'}>{formatMessage('hvaSkjerPanel.punkt2.label')}</Label>
          <BodyLong spacing>
            {formatElement('hvaSkjerPanel.punkt2.tekst', {
              // @ts-ignore-line
              a: (chunks: string[]) => (
                <Link
                  target="_blank"
                  href="https://www.nav.no/soknader/nb/person/arbeid/arbeidsavklaringspenger/NAV%2011-13.05/klage-eller-anke/brev"
                >
                  {chunks?.[0]}
                </Link>
              ),
            })}
          </BodyLong>
        </li>
        <li>
          <Label as={'p'}>{formatMessage('hvaSkjerPanel.punkt3.label')}</Label>
          <BodyShort spacing>{formatMessage('hvaSkjerPanel.punkt3.tekst')}</BodyShort>
          <ul>
            <li>
              {formatElement('hvaSkjerPanel.punkt3.punkt1', {
                // @ts-ignore-line
                a: (chunks: string[]) => (
                  <Link target="_blank" href="https://arbeidsplassen.nav.no/">
                    {chunks?.[0]}
                  </Link>
                ),
              })}
            </li>
            <li>{formatMessage('hvaSkjerPanel.punkt3.punkt2')}</li>
            <li>{formatMessage('hvaSkjerPanel.punkt3.punkt3')}</li>
          </ul>
        </li>
        <li>
          <Label as={'p'}>{formatMessage('hvaSkjerPanel.punkt4.label')}</Label>
          <BodyLong spacing>{formatMessage('hvaSkjerPanel.punkt4.tekst')}</BodyLong>
        </li>
        <li>
          <Label as={'p'}>{formatMessage('hvaSkjerPanel.punkt5.label')}</Label>
          <BodyLong spacing>
            {formatElement('hvaSkjerPanel.punkt5.tekst', {
              // @ts-ignore-line
              a: (chunks: string[]) => (
                <Link
                  target="_blank"
                  href={
                    'https://www.nav.no/soknader/nb/person/arbeid/arbeidsavklaringspenger/NAV%2011-13.05/klage-eller-anke/brev'
                  }
                >
                  {chunks?.[0]}
                </Link>
              ),
            })}
          </BodyLong>
          <BodyLong spacing>{formatMessage('hvaSkjerPanel.punkt5.tekst2')}</BodyLong>
        </li>
      </ul>
    </Panel>
  );
};
