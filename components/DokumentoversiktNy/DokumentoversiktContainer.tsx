import { Dokumentoversikt } from './Dokumentoversikt';
import { Heading, BodyShort, ReadMore } from '@navikt/ds-react';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { Dokument } from 'lib/types/types';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SkeletonDokumentOversikt } from './SkeletonDokumentOversikt';

export const DokumentoversiktContainer = () => {
  const { formatMessage } = useIntl();

  const [dokumenter, setDokumenter] = useState<Dokument[] | undefined>(undefined);

  useEffect(() => {
    const getDokumenter = async () => {
      const result = await fetch('/aap/mine-aap/api/dokumenter/');
      if (!result.ok) {
        setDokumenter([]);
      }
      const json = await result.json();
      setDokumenter(json);
    };
    getDokumenter();
  }, []);

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

        {dokumenter ? <Dokumentoversikt dokumenter={dokumenter} /> : <SkeletonDokumentOversikt />}
      </div>
    </PageComponentFlexContainer>
  );
};
