import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Heading } from '@navikt/ds-react';
import { VerticalFlexContainer } from 'components/FlexContainer/VerticalFlexContainer';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';
import { SoknadMedDatafetching } from 'components/Soknad/SoknadMedDatafetching';
import { Link } from 'i18n/routing';
import { hentSøknader } from 'lib/services/innsendingService';
import { getTranslations } from 'next-intl/server';

const Page = async () => {
  const t = await getTranslations('');

  const søknader = await hentSøknader();

  return (
    <Layout>
      <Section>
        <div>
          <Heading level="2" size="medium" spacing>
            {t('dineSøknader.heading')}
          </Heading>
          <VerticalFlexContainer>
            {søknader.map((søknad) => (
              <SoknadMedDatafetching key={søknad.innsendingsId} søknad={søknad} />
            ))}
          </VerticalFlexContainer>
        </div>
      </Section>
      <Section>
        <div>
          <Link href="/">
            <ArrowLeftIcon />
            {t('tilbakeTilMineAAPKnapp')}
          </Link>
        </div>
      </Section>
    </Layout>
  );
};

export default Page;
