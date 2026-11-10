import { Alert, BodyLong, BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { Breadcrumbs } from 'components/StatusISak/Breadcrumbs/Breadcrumbs';
import { SaksoversiktCard } from 'components/StatusISak/Saksoversikt/SaksoversiktCard/SaksoversiktCard';
import { BehandlingerList } from 'components/StatusISak/TidligereBehandlinger/BehandlingerList';
import { TilbakeLink } from 'components/StatusISak/TilbakeLink/TilbakeLink';
import { redirect } from 'i18n/routing';
import { hentSakMedBehandlinger } from 'lib/services/apiInternServiceNew';
import { isError } from 'lib/utils/api-fetch';
import { isProduction } from 'lib/utils/environments';

interface PageParams {
  locale: string;
  saksnummer: string;
}

const Page = async ({ params }: Readonly<{ params: Promise<PageParams> }>) => {
  const { locale, saksnummer } = await params;

  if (isProduction()) {
    redirect({
      href: '/',
      locale,
    });
  }

  const sakMedBehandlinger = await hentSakMedBehandlinger(saksnummer);

  if (isError(sakMedBehandlinger)) {
    return <Alert variant={'error'}>{'Noe gikk galt ved henting av behandlingen'}</Alert>;
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
        {sakMedBehandlinger.data?.behandlinger && sakMedBehandlinger.data?.behandlinger.length > 0 ? (
          <BehandlingerList sakMedBehandlinger={sakMedBehandlinger.data} />
        ) : (
          <BodyShort>Ingen behandlinger funnet for sak</BodyShort>
        )}
        <TilbakeLink />
      </VStack>
    </HStack>
  );
};

export default Page;
