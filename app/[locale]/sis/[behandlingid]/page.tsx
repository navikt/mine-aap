import { BodyShort } from '@navikt/ds-react';
import { redirect } from 'i18n/routing';
import { isProduction } from 'lib/utils/environments';

interface PageParams {
  locale: string;
  behandlingid: string;
}
const Page = async ({ params }: Readonly<{ params: Promise<PageParams> }>) => {
  const { locale } = await params;
  if (isProduction()) {
    redirect({
      href: '/',
      locale,
    });
  }
  return <BodyShort>Status i behandling</BodyShort>;
};

export default Page;
