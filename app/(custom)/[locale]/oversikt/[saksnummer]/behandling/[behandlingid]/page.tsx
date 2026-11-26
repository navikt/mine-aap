import { Alert, Heading, HStack, VStack } from '@navikt/ds-react';
import { Breadcrumbs } from 'components/StatusISak/Breadcrumbs/Breadcrumbs';
import DatoOgReferansenummer from 'components/StatusISak/DatoOgReferansenummer/DatoOgReferansenummer';
import { Hjelpetekst } from 'components/StatusISak/Hjelpetekst/Hjelpetekst';
import { SøknadshjelpLinkcard } from 'components/StatusISak/SøknadshjelpLinkcard/SøknadshjelpCard';
import { Tidslinje } from 'components/StatusISak/Tidslinje/Tidslinje';
import { redirect } from 'i18n/routing';
import { hentBehandling } from 'lib/services/apiInternServiceNew';
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

  if (isError(behandling)) {
    return <Alert variant={'error'}>{'Noe gikk galt ved henting av behandlingen'}</Alert>;
  }

  if (!behandling.data) {
    return <Alert variant={'warning'}>{'Ingen behandling funnet'}</Alert>;
  }

  //TODO: Faste regler for undefined og null. Ville nok gjort dato opprettet til eget felt i API-responsen.
  const datoOpprettet = behandling.data.hendelser.find((hendelse) => hendelse.navn === 'SØKNAD_MOTTATT')?.sistEndret;

  return (
    <HStack justify={'center'}>
      <VStack gap={'space-16'}>
        <Breadcrumbs
          breadcrumbItems={[
            { label: 'Min side', href: '/minside' },
            { label: 'Oversikt', href: `/aap/mine-aap/${locale}/oversikt` },
            {
              label: 'Behandling',
              href: `/aap/mine-aap/${locale}/oversikt/${saksnummer}/behandling/${behandlingid}`,
            },
          ]}
        />
        <Heading level={'1'} size={'xlarge'} spacing>
          {mapBehandlingstypeTilHeading(behandling.data.behandlingType)}
        </Heading>
        <Tidslinje behandling={behandling.data} />
        <Hjelpetekst />
        <SøknadshjelpLinkcard />
        <DatoOgReferansenummer dato={datoOpprettet} referansenummer={behandling.data.behandlingReferanse} />
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
