import { Alert, HStack } from '@navikt/ds-react';
import { BehandlingProcess } from 'components/statusisak/behandlingprocess/BehandlingProcess';
import { redirect } from 'i18n/routing';
import { hentBehandling } from 'lib/services/apiInternService';
import { isError } from 'lib/utils/api-fetch';
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
  if (isError(behandling)) {
    return <Alert variant={'error'}>{'Noe gikk galt ved henting av behandlingen'}</Alert>;
  }

  if (!behandling.data) {
    return <Alert variant={'warning'}>{'Ingen behandling funnet'}</Alert>;
  }
  return (
    <HStack justify={'center'}>
      <BehandlingProcess behandling={behandling.data} />
    </HStack>
  );
};

export default Page;
