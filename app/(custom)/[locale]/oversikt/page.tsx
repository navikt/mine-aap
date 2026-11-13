import { Alert, Heading, VStack } from '@navikt/ds-react';
import { BehandlingsCard } from 'components/StatusISak/Behandlingscard/BehandlingsCard';
import { Breadcrumbs } from 'components/StatusISak/Breadcrumbs/Breadcrumbs';
import { MeldekortlenkeNy } from 'components/StatusISak/MeldekortlenkeNy/MeldekortlenkeNy';
import { SnarveierLenkeliste } from 'components/StatusISak/Snarveier/SnarveierLenkeliste';
import { Statuskort } from 'components/StatusISak/Statuskort/Statuskort';
import { TilbakeLink } from 'components/StatusISak/TilbakeLink/TilbakeLink';
import { redirect } from 'i18n/routing';
import { logInfo } from 'lib/server/logger';
import { hentSakerMedBehandlinger } from 'lib/services/apiInternServiceNew';
import type { Behandling } from 'lib/types/apiinternTypes';
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

  const sakerMedBehandlinger = await hentSakerMedBehandlinger();

  if (isError(sakerMedBehandlinger)) {
    return <Alert variant={'error'}>{'Noe gikk galt ved henting av behandlinger'}</Alert>;
  }
  logInfo(JSON.stringify(sakerMedBehandlinger));
  const aktivSak = sakerMedBehandlinger.data.find((sak) => sak.sakStatus === 'SOKNAD_UNDER_BEHANDLING');

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
      {aktivSak?.behandlinger.filter(ikkeVedtatteBehandling).map((behandling) => (
        <BehandlingsCard
          key={behandling.behandlingReferanse}
          saksnummer={aktivSak.saksnummer}
          behandling={behandling}
        />
      ))}
      <MeldekortlenkeNy />
      <SnarveierLenkeliste />
      <TilbakeLink />
    </VStack>
  );
};

function ikkeVedtatteBehandling(behandling: Behandling) {
  return !behandling.avsluttet;
}

export default Page;
