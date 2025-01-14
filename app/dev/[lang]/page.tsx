import { logInfo } from '@navikt/aap-felles-utils';
import { Heading } from '@navikt/ds-react';
import { getDictionary } from 'app/dev/[lang]/dictionaries';
import { DokumentoversiktMedDatafetching } from 'components/DokumentoversiktNy/DokumentoversiktMedDatafetching';
import { ForsideIngress } from 'components/Forside/Ingress/ForsideIngress';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { hentSøknader } from 'lib/services/innsendingService';
import { hentDokumenter } from 'lib/services/oppslagService';
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
  const dokumenter = await hentDokumenter();
  const søknader = await hentSøknader();

  logInfo('Dokumenter', dokumenter);
  logInfo('Søknader', søknader);

  return (
    <div>
      <PageComponentFlexContainer>
        <Heading level="1" size="large" spacing>
          {dict.appTittelMedSkille /* TODO: Add shy */}
        </Heading>
        <ForsideIngress>{dict.appIngress}</ForsideIngress>
      </PageComponentFlexContainer>
      <DokumentoversiktMedDatafetching />
    </div>
  );
};

export default Page;
