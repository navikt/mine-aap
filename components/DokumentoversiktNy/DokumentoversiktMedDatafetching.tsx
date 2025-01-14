import { Heading, BodyShort, ReadMore } from '@navikt/ds-react';
import { getDictionary } from 'app/dev/[lang]/dictionaries';
//import { Dokumentoversikt } from 'components/DokumentoversiktNy/Dokumentoversikt';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
//import { hentDokumenter } from 'lib/services/oppslagService';
//import { Dokument } from 'lib/types/types';

export const DokumentoversiktMedDatafetching = async () => {
  //const dokumenter = (await hentDokumenter());

  const dict = await getDictionary('nb');

  return (
    <PageComponentFlexContainer subtleBackground>
      <div style={{ maxWidth: '600px' }}>
        <Heading level="2" size="medium" spacing>
          {dict.dokumentoversikt.tittel}
        </Heading>
        <BodyShort spacing>{dict.dokumentoversikt.tekst}</BodyShort>
        <ReadMore header={dict.dokumentoversikt.manglendeDokument.header}>
          <BodyShort spacing>{dict.dokumentoversikt.manglendeDokument.tekst}</BodyShort>
        </ReadMore>

        {/*<Dokumentoversikt dokumenter={dokumenter} />*/}
      </div>
    </PageComponentFlexContainer>
  );
};
