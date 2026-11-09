import { Alert, BodyLong, Heading, HStack, VStack } from '@navikt/ds-react';
import { Breadcrumbs } from 'components/StatusISak/Breadcrumbs/Breadcrumbs';
import { SaksoversiktCard } from 'components/StatusISak/Saksoversikt/SaksoversiktCard/SaksoversiktCard';
import { BehandlingerList } from 'components/StatusISak/TidligereBehandlinger/BehandlingerList';
import { TilbakeLink } from 'components/StatusISak/TilbakeLink/TilbakeLink';
import { redirect } from 'i18n/routing';
import { hentBehandlinger } from 'lib/services/apiInternService';
import { isError } from 'lib/utils/api-fetch';
import { isProduction } from 'lib/utils/environments';

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

  const behandlinger = await hentBehandlinger();

  if (isError(behandlinger)) {
    return <Alert variant={'error'}>{'Noe gikk galt ved henting av behandlingen'}</Alert>;
  }

  if (!behandlinger.data) {
    return <Alert variant={'warning'}>{'Ingen behandling funnet'}</Alert>;
  }

  return (
    <HStack justify={'center'}>
      <VStack gap={'space-16'}>
        <Breadcrumbs
          breadcrumbItems={[
            { label: 'Min side', href: '/minside' },
            { label: 'Arbeidsavklaringspenger', href: '/aap/mine-aap/nb/oversikt/' },
          ]}
        />
        <div>
          <Heading level={'1'} size={'xlarge'} spacing style={{ marginBottom: '0.75rem' }}>
            {'Saksoversikt'}
          </Heading>
          <BodyLong size="large">
            {'Her finner du en oversikt over saken din akkurat nå. Aktivet viser alle tidligere behandlinger.'}
          </BodyLong>
        </div>
        <SaksoversiktCard />
        <BehandlingerList behandlinger={behandlinger} />
        <TilbakeLink />
      </VStack>
    </HStack>
  );
};

export default Page;
