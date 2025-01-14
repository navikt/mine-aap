import { Heading } from '@navikt/ds-react';
import { getDictionary } from 'app/dev/[lang]/dictionaries';
import { DokumentoversiktMedDatafetching } from 'components/DokumentoversiktNy/DokumentoversiktMedDatafetching';
import { ForsideIngress } from 'components/Forside/Ingress/ForsideIngress';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { isProduction } from 'lib/utils/environments';
import { notFound } from 'next/navigation';

interface PageParams {
  lang: 'nb' | 'nn';
}

const Page = async ({ params }: Readonly<{ params: Promise<PageParams> }>) => {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  if (isProduction()) {
    return notFound();
  }

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
