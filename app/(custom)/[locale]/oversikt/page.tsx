import { Alert, Heading, HStack, VStack } from '@navikt/ds-react';
import { BehandlingsCard } from 'components/StatusISak/Behandlingscard/BehandlingsCard';
import { Breadcrumbs } from 'components/StatusISak/Breadcrumbs/Breadcrumbs';
import { MeldekortlenkeNy } from 'components/StatusISak/MeldekortlenkeNy/MeldekortlenkeNy';
import { TilbakeLink } from 'components/StatusISak/TilbakeLink/TilbakeLink';
import { SnarveierLenkeliste } from 'components/StatusISak/Snarveier/SnarveierLenkeliste';
import { Statuskort } from 'components/StatusISak/Statuskort/Statuskort';
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
    <VStack gap={'space-16'}>
      <Breadcrumbs
        breadcrumbItems={[
          { label: 'Min side', href: '/minside' },
          { label: 'Oversikt', href: '/aap/mine-aap/nb/oversikt/' },
        ]}
      />
      <Heading level={'1'} size={'xlarge'} spacing>
        {'Arbeidsavklaringspenger'}
      </Heading>
      <Statuskort
        status={'aktiv'}
        saksNummer={'123 456 789'}
        betalerTil={'Arbeidsgiver'}
        nesteUtbetalingSum={'35 500kr etter trekk'}
        utbetalingsdato={'25. September'}
      />
      {behandlinger.data.filter(ikkeVedtatteBehandling).map((behandling) => (
        <BehandlingsCard key={behandling.behandlingId} behandling={behandling} />
      ))}
      <MeldekortlenkeNy />
      <SnarveierLenkeliste />
      <TilbakeLink />
    </VStack>
  );
};

function ikkeVedtatteBehandling(behandling: Behandling) {
  return !behandling.vedtakFattet;
}

export default Page;
