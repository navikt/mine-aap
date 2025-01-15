import { BodyShort, Heading } from '@navikt/ds-react';
import { getDictionary } from 'app/dev/[lang]/dictionaries';
import { Card } from 'components/Card/Card';
import { ClientButton } from 'components/ClientButton';
import { DokumentoversiktMedDatafetching } from 'components/DokumentoversiktNy/DokumentoversiktMedDatafetching';
import { ForsideIngress } from 'components/Forside/Ingress/ForsideIngress';
import { NyttigÅViteServer } from 'components/NyttigÅVite/NyttigÅViteServer';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { SoknadMedDatafetching } from 'components/Soknad/SoknadMedDatafetching';
import { hentSøknader } from 'lib/services/innsendingService';
import { isProduction } from 'lib/utils/environments';
import { notFound } from 'next/navigation';

interface PageParams {
  lang: 'nb' | 'nn';
}

const Page = async ({ params }: Readonly<{ params: Promise<PageParams> }>) => {
  if (isProduction()) {
    return notFound();
  }

  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  // Debug for å teste dokumenter og søknader i dev
  const søknader = await hentSøknader();

  const sisteSøknadInnsendingNy = søknader[0];

  return (
    <div>
      <PageComponentFlexContainer>
        <Heading level="1" size="large" spacing>
          {dict.appTittelMedSkille /* TODO: Add shy */}
        </Heading>
        <ForsideIngress>{dict.appIngress}</ForsideIngress>
      </PageComponentFlexContainer>
      {sisteSøknadInnsendingNy && (
        <PageComponentFlexContainer subtleBackground>
          <Heading level="2" size="medium" spacing>
            {dict.minSisteSøknad.heading}
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
              {dict.forside.ettersendelse.tittel}
            </Heading>
            <Card subtleBlue>
              <BodyShort spacing>{dict.forside.ettersendelse.tekst}</BodyShort>
              <ClientButton url="/aap/mine-aap/ettersendelse" text={dict.forside.ettersendelse.knapp}></ClientButton>
            </Card>
          </PageComponentFlexContainer>
        </>
      )}
      <PageComponentFlexContainer>
        <NyttigÅViteServer />
      </PageComponentFlexContainer>
      <PageComponentFlexContainer>
        <Heading level="2" size="medium" spacing>
          {dict.forside.endretSituasjon.heading}
        </Heading>
        <Card subtleBlue>
          <BodyShort spacing>{dict.forside.endretSituasjon.tekst}</BodyShort>
          <ClientButton
            url="https://innboks.nav.no/s/skriv-til-oss?category=Arbeid"
            text={dict.forside.endretSituasjon.knapp}
          ></ClientButton>
        </Card>
      </PageComponentFlexContainer>
      {sisteSøknadInnsendingNy && <DokumentoversiktMedDatafetching />}
    </div>
  );
};

export default Page;
