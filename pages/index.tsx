import { Attachment, Information } from '@navikt/ds-icons';
import { Alert, BodyShort, Button, Heading, Link, LinkPanel, Panel } from '@navikt/ds-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import type { GetServerSidePropsResult, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { getAccessToken } from '../auth/accessToken';
import { beskyttetSide } from '../auth/beskyttetSide';
import { Layout } from '../components/Layout/Layout';
import { PanelWithTopIcon } from '../components/PanelWithTopIcon/PanelWithTopIcon';
import { Section } from '../components/Section/Section';
import { useFeatureToggleIntl } from '../hooks/useFeatureToggleIntl';
import { Dokument, MellomlagretSøknad, Søknad } from '../types/types';
import { formatFullDate } from '../utils/date';
import { getDocuments } from './api/dokumentoversikt';
import { getMellomlagredeSøknader } from './api/mellomlagredeSoknader';
import { getSøknader } from './api/soknader';

interface PageProps {
  søknader: Søknad[];
  dokumenter: Dokument[];
  mellomlagredeSøknader: MellomlagretSøknad[];
}

const Index = ({ søknader, dokumenter, mellomlagredeSøknader }: PageProps) => {
  const intl = useFeatureToggleIntl();

  const router = useRouter();

  const sisteSøknad = useMemo(() => {
    return søknader[0];
  }, [søknader]);

  const sisteMellomlagredeSøknad = useMemo(() => {
    return mellomlagredeSøknader[0];
  }, [mellomlagredeSøknader]);

  return (
    <Layout>
      {sisteMellomlagredeSøknad && (
        <Section>
          <div>
            <Heading level="2" size="medium" spacing>
              Vil du fortsette der du slapp?
            </Heading>
            <LinkPanel href="/aap/soknad/standard" border>
              <LinkPanel.Title>Søknad om arbeidsavklaringspenger</LinkPanel.Title>
              <LinkPanel.Description>
                Lagres til og med{' '}
                {format(new Date(sisteMellomlagredeSøknad.timestamp), 'EEEE dd.MM yy', {
                  locale: nb,
                })}
              </LinkPanel.Description>
            </LinkPanel>
          </div>
        </Section>
      )}

      {sisteSøknad && (
        <Section lightBlue>
          <div>
            <Heading level="2" size="medium" spacing>
              Din siste søknad om arbeidsavklaringspenger
            </Heading>
            <Panel border>
              <Heading level="3" size="small">
                Søknad om arbeidsavklaringspenger (AAP)
              </Heading>
              <BodyShort spacing>Mottatt {formatFullDate(sisteSøknad.timestamp)}</BodyShort>
              <BodyShort spacing>
                <Link href="#">Se forventet saksbehandlingstid</Link>
              </BodyShort>
              {sisteSøknad.missingDocuments.length > 0 && (
                <>
                  <Alert variant="warning">
                    Vi mangler dokumentasjon på {sisteSøknad.missingDocuments.join(', ')}
                  </Alert>
                  <Button variant="primary" onClick={() => router.push('/ettersendelse/')}>
                    Ettersend dokumentasjon
                  </Button>
                </>
              )}
              <Heading level="3" size="small">
                Dokumentasjon vi har mottatt fra deg
              </Heading>
              <ul>
                <li>
                  <Link href={sisteSøknad.applicationPdf.url}>
                    Søknad om arbeidsavklaringspenger (AAP) mottatt{' '}
                    {formatFullDate(sisteSøknad.applicationPdf.timestamp)} (pdf)
                  </Link>
                </li>
                {sisteSøknad.documents.map((document) => (
                  <li key={document.tittel}>
                    <Link href={document.url}>
                      Vedlegg: {document.tittel} mottatt {formatFullDate(document.timestamp)} (
                      {document.type})
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </Section>
      )}

      <Section>
        <PanelWithTopIcon title={intl.formatMessage('dineOppgaver.tittel')} icon={<Information />}>
          <BodyShort spacing>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</BodyShort>
        </PanelWithTopIcon>
        <PanelWithTopIcon title={intl.formatMessage('hvaGjorVi.tittel')} icon={<Information />}>
          <BodyShort spacing>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</BodyShort>
        </PanelWithTopIcon>
        <PanelWithTopIcon
          title={intl.formatMessage('dokumentoversikt.tittel')}
          icon={<Attachment />}
        >
          <BodyShort spacing>
            <Link href="#">{intl.formatMessage('dokumentoversikt.ikkeSynligDokumentLink')}</Link>
          </BodyShort>
          {dokumenter.map((dokument) => (
            <LinkPanel href={dokument.url} border key={dokument.tittel}>
              <LinkPanel.Title>{dokument.tittel}</LinkPanel.Title>
              <LinkPanel.Description>
                {intl.formatMessage('dokumentoversikt.mottatt')}{' '}
                {formatFullDate(dokument.timestamp)}
              </LinkPanel.Description>
            </LinkPanel>
          ))}
        </PanelWithTopIcon>
      </Section>
    </Layout>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
    const bearerToken = getAccessToken(ctx);
    const søknader = await getSøknader(bearerToken);
    const dokumenter = await getDocuments();
    const mellomlagredeSøknader = await getMellomlagredeSøknader();

    return {
      props: { søknader, dokumenter, mellomlagredeSøknader },
    };
  }
);

export default Index;
