import { Accordion, BodyShort, Heading, Panel, ReadMore } from '@navikt/ds-react';
import { VerticalFlexContainer } from 'components/FlexContainer/VerticalFlexContainer';
import { Dokument } from 'lib/types/types';
import { formatFullDate } from 'lib/utils/date';
import Link from 'next/link';
import { useIntl } from 'react-intl';

interface Props {
  dokumenter: Dokument[];
}

export const Dokumentoversikt = ({ dokumenter }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Panel border>
      <Heading level="2" size="medium" spacing>
        {formatMessage({ id: 'dokumentoversikt.tittel' })}
      </Heading>
      <ReadMore header={formatMessage({ id: 'dokumentoversikt.manglendeDokument.header' })}>
        <BodyShort>{formatMessage({ id: 'dokumentoversikt.manglendeDokument.tekst' })}</BodyShort>
        {formatMessage({ id: 'dokumentoversikt.manglendeDokument.bulletsTekst' })}
        <ul>
          <li>{formatMessage({ id: 'dokumentoversikt.manglendeDokument.bullet1' })}</li>
          <li>{formatMessage({ id: 'dokumentoversikt.manglendeDokument.bullet2' })}</li>
          <li>{formatMessage({ id: 'dokumentoversikt.manglendeDokument.bullet3' })}</li>
        </ul>
      </ReadMore>
      <VerticalFlexContainer>
        {dokumenter.map((dokument) => (
          <Accordion key={dokument.dokumentId}>
            <Accordion.Item>
              <Accordion.Header>{dokument.tittel}</Accordion.Header>
              <Accordion.Content>
                <BodyShort spacing>Mottatt {formatFullDate(dokument.dato)}</BodyShort>
                <BodyShort spacing>
                  <Link
                    href={`/api/dokument/?journalpostId=${dokument.journalpostId}&dokumentId=${dokument.dokumentId}`}
                    target="_blank"
                  >
                    Last ned dokumentet
                  </Link>
                </BodyShort>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        ))}
      </VerticalFlexContainer>
    </Panel>
  );
};
