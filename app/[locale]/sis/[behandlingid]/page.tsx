import { BodyShort, HStack } from '@navikt/ds-react';
import { BehandlingProcess } from 'components/statusisak/behandlingprocess/BehandlingProcess';
import { redirect } from 'i18n/routing';
import { hentBehandling } from 'lib/services/apiInternService';
import { isProduction } from 'lib/utils/environments';

interface PageParams {
  locale: string;
  behandlingid: string;
}
const Page = async ({ params }: Readonly<{ params: Promise<PageParams> }>) => {
  const { locale, behandlingid } = await params;
  if (isProduction()) {
    redirect({
      href: '/',
      locale,
    });
  }
  const behandling = await hentBehandling(behandlingid);

  if (!behandling) {
    return <BodyShort>Ingen behandling funnet</BodyShort>;
  }
  return (
    <HStack justify={'center'}>
      <BehandlingProcess behandling={behandling} />
    </HStack>
  );
};

export default Page;
