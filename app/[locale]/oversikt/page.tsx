import { Alert, Heading, HStack, VStack } from '@navikt/ds-react';
import { BehandlingLinkCard } from 'components/statusisak/behandlinglinkcard/BehandlingLinkCard';
import { redirect } from 'i18n/routing';
import { type Behandling, hentBehandlinger } from 'lib/services/apiInternService';
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
    return <Alert variant={'error'}>{'Noe gikk galt ved henting av behandlinger'}</Alert>;
  }

  return (
    <HStack justify={'center'}>
      <VStack gap={"space-16"}>
        <Heading level={'1'} size={'xlarge'} spacing>
          {'Arbeidsavklaringspenger (AAP)'}
        </Heading>
        {behandlinger.data.filter(ikkeVedtatteBehandling).map((behandling) => (
          <BehandlingLinkCard key={behandling.behandlingId} behandling={behandling} />
        ))}
      </VStack>
    </HStack>
  );
};

function ikkeVedtatteBehandling(behandling: Behandling) {
  return !behandling.vedtakFattet;
}

export default Page;
