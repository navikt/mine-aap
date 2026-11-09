import { Alert, Heading, VStack } from '@navikt/ds-react';
import { Breadcrumbs } from 'components/StatusISak/Breadcrumbs/Breadcrumbs';
import { TilbakeLink } from 'components/StatusISak/TilbakeLink/TilbakeLink';
import { redirect } from 'i18n/routing';
import { hentJournalpost } from 'lib/services/apiInternService';
import { isError } from 'lib/utils/api-fetch';
import { isProduction } from 'lib/utils/environments';
import SingleJournalpost from 'components/StatusISak/Dokumentvisning/SingleJournalpost';

interface PageParams {
  locale: string;
}
const Page = async ({ params }: Readonly<{ params: Promise<PageParams> }>) => {
  const { locale } = await params;

  if (isProduction()) {
    redirect({
      href: '/',
      locale,
    });
  }
  //TODO: json format og navngiving av "journalpost", gitt at vi ønsker lik funksjonalitet som i dokumentarkivet
  const journalpost = await hentJournalpost();

  if (isError(journalpost)) {
    return <Alert variant={'error'}>{'Noe gikk galt ved henting av dokumenter'}</Alert>;
  }

  return (
    <VStack gap={'space-16'}>
      <Breadcrumbs
        breadcrumbItems={[
          { label: 'Min side', href: '/minside' },
          { label: 'Oversikt', href: '/aap/mine-aap/nb/oversikt/' },
        ]}
      />
      <SingleJournalpost journalpost={journalpost.data} />
      <TilbakeLink />
    </VStack>
  );
};

export default Page;
