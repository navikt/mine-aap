import { Alert, Heading, HStack, VStack } from '@navikt/ds-react';
import { Breadcrumbs } from 'components/StatusISak/Breadcrumbs/Breadcrumbs';
import DatoOgReferansenummer from 'components/StatusISak/DatoOgReferansenummer/DatoOgReferansenummer';
import { DokumentList } from 'components/StatusISak/DokumentList/DokumentList';
import { Hjelpetekst } from 'components/StatusISak/Hjelpetekst/Hjelpetekst';
import { SøknadshjelpLinkcard } from 'components/StatusISak/SøknadshjelpLinkcard/SøknadshjelpCard';
import { Tidslinje } from 'components/StatusISak/Tidslinje/Tidslinje';
import { redirect } from 'i18n/routing';
import { hentBehandling } from 'lib/services/apiInternServiceNew';
import { hentDokumenter } from 'lib/services/oppslagService';
import { isError } from 'lib/utils/api-fetch';
import { isProduction } from 'lib/utils/environments';

interface PageParams {
  locale: string;
  saksnummer: string;
  behandlingid: string;
}
const Page = async ({ params }: Readonly<{ params: Promise<PageParams> }>) => {
  const { locale, saksnummer, behandlingid } = await params;
  if (isProduction()) {
    redirect({
      href: '/',
      locale,
    });
  }
  const behandling = await hentBehandling(saksnummer, behandlingid);

  //TODO: avklare om det er mulig å hente dokumenter spesifikt for denne behandlingen
  //TODO: hvis ikke, avklare hva vi gjør med visning av dokumenter og tilpasse deretter
  const dokumenter = await hentDokumenter();

  if (isError(behandling)) {
    return <Alert variant={'error'}>{'Noe gikk galt ved henting av behandlingen'}</Alert>;
  }

  if (isError(dokumenter)) {
    return <Alert variant={'error'}>{'Noe gikk galt ved henting av dokumentene'}</Alert>;
  }

  if (!behandling.data) {
    return <Alert variant={'warning'}>{'Ingen behandling funnet'}</Alert>;
  }
  return (
    <HStack justify={'center'}>
      <VStack gap={'space-16'}>
        <Breadcrumbs
          breadcrumbItems={[
            { label: 'Min side', href: '/minside' },
            { label: 'Oversikt', href: '/aap/mine-aap/nb/oversikt/' },
            {
              label: 'Behandling',
              href: `/aap/mine-aap/nb/oversikt/behandling/${behandlingid}`,
            },
          ]}
        />
        <Heading level={'1'} size={'xlarge'} spacing>
          {mapBehandlingstypeTilHeading(behandling.data.behandlingType)}
        </Heading>
        <Tidslinje behandling={behandling.data} />
        <Hjelpetekst />
        <SøknadshjelpLinkcard />
        <DatoOgReferansenummer dato={'2026-01-01'} referansenummer={behandling.data.behandlingReferanse} />
        <DokumentList dokument={{ data: dokumenter.data }} />
      </VStack>
    </HStack>
  );
};
function mapBehandlingstypeTilHeading(behandlingsType: string) {
  switch (behandlingsType) {
    case 'SØKNAD':
      return 'Status på søknad om Arbeidsavklaringspenger';
    case 'KLAGE':
      return 'Status på klage';
    default:
      return behandlingsType;
  }
}

export default Page;
