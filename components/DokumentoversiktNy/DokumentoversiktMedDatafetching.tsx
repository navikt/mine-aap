import { Heading, BodyShort, ReadMore } from '@navikt/ds-react';
import { Dokumentoversikt } from 'components/DokumentoversiktNy/Dokumentoversikt';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { getTranslations } from 'next-intl/server';
import { hentDokumenter } from 'lib/services/oppslagService';
//import { Dokument } from 'lib/types/types';

export const DokumentoversiktMedDatafetching = async () => {
  const t = await getTranslations('dokumentoversikt');
  const dokumenter = await hentDokumenter();

  return (
    <PageComponentFlexContainer subtleBackground>
      <div style={{ maxWidth: '600px' }}>
        <Heading level="2" size="medium" spacing>
          {t('tittel')}
        </Heading>
        <BodyShort spacing>{t('tekst')}</BodyShort>
        <ReadMore header={t('manglendeDokument.header')}>
          <BodyShort spacing>{t('manglendeDokument.tekst')}</BodyShort>
        </ReadMore>

        <Dokumentoversikt dokumenter={dokumenter} />
      </div>
    </PageComponentFlexContainer>
  );
};
