import { Panel, Heading, BodyShort, LinkPanel } from '@navikt/ds-react';
import { VerticalFlexContainer } from 'components/FlexContainer/VerticalFlexContainer';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { Dokument } from 'lib/types/types';
import { formatFullDate } from 'lib/utils/date';
import Link from 'next/link';

interface Props {
  dokumenter: Dokument[];
}

export const Dokumentoversikt = ({ dokumenter }: Props) => {
  const { formatMessage } = useFeatureToggleIntl();
  return (
    <Panel border>
      <Heading level="2" size="medium" spacing>
        {formatMessage('dokumentoversikt.tittel')}
      </Heading>
      <BodyShort spacing>
        <Link href="#">{formatMessage('dokumentoversikt.ikkeSynligDokumentLink')}</Link>
      </BodyShort>
      <VerticalFlexContainer>
        {dokumenter.map((dokument) => (
          <LinkPanel href={dokument.url} border key={dokument.tittel}>
            <LinkPanel.Title>{dokument.tittel}</LinkPanel.Title>
            <LinkPanel.Description>
              {formatMessage('dokumentoversikt.mottatt')} {formatFullDate(dokument.timestamp)}
            </LinkPanel.Description>
          </LinkPanel>
        ))}
      </VerticalFlexContainer>
    </Panel>
  );
};
