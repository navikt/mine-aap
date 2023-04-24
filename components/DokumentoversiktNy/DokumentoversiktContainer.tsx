import { Dokumentoversikt } from './Dokumentoversikt';
import { Heading, BodyShort, ReadMore } from '@navikt/ds-react';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { Dokument } from 'lib/types/types';
import { FormattedMessage, useIntl } from 'react-intl';

export const DokumentoversiktContainer = ({ dokumenter }: { dokumenter: Dokument[] }) => {
  const { formatMessage } = useIntl();
  return (
    <PageComponentFlexContainer subtleBackground>
      <div style={{ maxWidth: '600px' }}>
        <Heading level="2" size="medium" spacing>
          <FormattedMessage id="dokumentoversikt.tittel" />
        </Heading>
        <BodyShort spacing>
          <FormattedMessage id="dokumentoversikt.tekst" />
        </BodyShort>
        <ReadMore header={formatMessage({ id: 'dokumentoversikt.manglendeDokument.header' })}>
          <BodyShort spacing>
            <FormattedMessage id="dokumentoversikt.manglendeDokument.tekst" />
          </BodyShort>
        </ReadMore>

        <Dokumentoversikt dokumenter={dokumenter} />
      </div>
    </PageComponentFlexContainer>
  );
};
