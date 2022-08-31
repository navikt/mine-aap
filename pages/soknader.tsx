import { Alert, BodyShort, Button, Heading, Link, Panel } from '@navikt/ds-react';
import { NextPageContext, GetServerSidePropsResult } from 'next';
import router from 'next/router';
import { getAccessToken } from '../auth/accessToken';
import { beskyttetSide } from '../auth/beskyttetSide';
import { VerticalFlexContainer } from '../components/FlexContainer/VerticalFlexContainer';
import { Layout } from '../components/Layout/Layout';
import { Section } from '../components/Section/Section';
import { useFeatureToggleIntl } from '../hooks/useFeatureToggleIntl';
import { Søknad } from '../types/types';
import { formatFullDate } from '../utils/date';
import logger from '../utils/logger';
import { getSøknader } from './api/soknader';

interface PageProps {
  søknader: Søknad[];
}

const Søknader = ({ søknader }: PageProps) => {
  const { formatMessage } = useFeatureToggleIntl();

  return (
    <Layout>
      <Section lightBlue>
        <div>
          <Heading level="2" size="medium" spacing>
            Dine innsendte søknader
          </Heading>
          <VerticalFlexContainer>
            {søknader.map((søknad) => (
              <Panel border key={søknad.søknadId}>
                <Heading level="3" size="small">
                  {formatMessage('sisteSøknad.søknad.heading')}
                </Heading>
                <BodyShort spacing>
                  {formatMessage('sisteSøknad.søknad.mottatt', {
                    date: formatFullDate(søknad.innsendtDato),
                  })}
                </BodyShort>
                <BodyShort spacing>
                  <Link href="#">{formatMessage('sisteSøknad.søknad.saksbehandlingstid')}</Link>
                </BodyShort>
                {(søknad.manglendeVedlegg?.length ?? 0) > 0 && (
                  <Alert variant="warning">
                    {formatMessage('sisteSøknad.søknad.alert.message', {
                      missingDocuments: søknad.manglendeVedlegg?.join(', '),
                    })}
                  </Alert>
                )}
                <Button
                  variant="primary"
                  onClick={() => router.push(`/${søknad.søknadId}/ettersendelse/`)}
                >
                  {formatMessage('sisteSøknad.søknad.button.text')}
                </Button>
                <Heading level="3" size="small">
                  {formatMessage('sisteSøknad.dokumentasjon.heading')}
                </Heading>
                <ul>
                  {søknad.innsendteVedlegg?.map((document) => (
                    <li key={`${document.vedleggType}-${document.innsendtDato}`}>
                      {formatMessage('sisteSøknad.dokumentasjon.vedlegg', {
                        date: formatFullDate(document.innsendtDato),
                        type: document.vedleggType,
                      })}
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </VerticalFlexContainer>
        </div>
      </Section>
    </Layout>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    const bearerToken = getAccessToken(ctx);
    const søknader = await getSøknader(bearerToken);

    logger.info(`søknader: ${JSON.stringify(søknader)}`);

    return {
      props: { søknader },
    };
  }
);

export default Søknader;
