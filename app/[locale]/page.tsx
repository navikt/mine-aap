import { BodyShort, Heading } from '@navikt/ds-react';
import { Card } from 'components/Card/Card';
import { ClientButton } from 'components/ClientButton';
import { DokumentoversiktMedDatafetching } from 'components/DokumentoversiktNy/DokumentoversiktMedDatafetching';
import { ForsideIngress } from 'components/Forside/Ingress/ForsideIngress';
import { NyttigÅViteServer } from 'components/NyttigÅVite/NyttigÅViteServer';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { SoknadMedDatafetching } from 'components/Soknad/SoknadMedDatafetching';
import { hentSøknader } from 'lib/services/innsendingService';
import { getTranslations } from 'next-intl/server';

const Page = async () => {
  const t = await getTranslations('');

  const søknader = await hentSøknader();

  const sisteSøknadInnsendingNy = søknader[0];

  return (
    <div>
      <PageComponentFlexContainer>
        <Heading level="1" size="large" spacing>
          {t('appTittelMedSkille') /* TODO: Add shy */}
        </Heading>
        <ForsideIngress>{t('appIngress')}</ForsideIngress>
      </PageComponentFlexContainer>

      {sisteSøknadInnsendingNy && (
        <PageComponentFlexContainer subtleBackground>
          <Heading level="2" size="medium" spacing>
            {t('minSisteSøknad.heading')}
          </Heading>
          <Card>
            <SoknadMedDatafetching søknad={sisteSøknadInnsendingNy} />
          </Card>
        </PageComponentFlexContainer>
      )}
      {!sisteSøknadInnsendingNy && (
        <>
          <DokumentoversiktMedDatafetching />
          <PageComponentFlexContainer>
            <Heading level="2" size="medium" spacing>
              {t('forside.ettersendelse.tittel')}
            </Heading>
            <Card subtleBlue>
              <BodyShort spacing>{t('forside.ettersendelse.tekst')}</BodyShort>
              <ClientButton url="/ettersendelse" text={t('forside.ettersendelse.knapp')}></ClientButton>
            </Card>
          </PageComponentFlexContainer>
        </>
      )}
      <PageComponentFlexContainer>
        <NyttigÅViteServer />
      </PageComponentFlexContainer>
      <PageComponentFlexContainer>
        <Heading level="2" size="medium" spacing>
          {t('forside.endretSituasjon.heading')}
        </Heading>
        <Card subtleBlue>
          <BodyShort spacing>{t('forside.endretSituasjon.tekst')}</BodyShort>
          <ClientButton
            url="https://innboks.nav.no/s/skriv-til-oss?category=Arbeid"
            text={t('forside.endretSituasjon.knapp')}
          ></ClientButton>
        </Card>
      </PageComponentFlexContainer>
      {sisteSøknadInnsendingNy && <DokumentoversiktMedDatafetching />}
    </div>
  );
};

export default Page;
