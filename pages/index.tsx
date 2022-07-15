import { Attachment, Information } from '@navikt/ds-icons';
import { Alert, BodyShort, Button, Heading, Link, LinkPanel, Panel } from '@navikt/ds-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import type { GetServerSidePropsResult } from 'next';
import { useMemo } from 'react';
import { beskyttetSide } from '../auth/beskyttetSide';
import { PanelWithTopIcon } from '../components/PanelWithTopIcon/PanelWithTopIcon';
import { Section } from '../components/Section/Section';
import { useFeatureToggleIntl } from '../hooks/useFeatureToggleIntl';
import { Dokument, getDocuments } from './api/dokumentoversikt';
import { getMellomlagretSøknad, MellomlagretSøknad } from './api/mellomlagretSoknad';
import { getSøknader, Søknad } from './api/soknader';

interface PageProps {
  søknader: Søknad[];
  dokumenter: Dokument[];
  mellomlagretSøknad?: MellomlagretSøknad;
}

const Index = ({ søknader, dokumenter, mellomlagretSøknad }: PageProps) => {
  const intl = useFeatureToggleIntl();

  const sisteSøknad = useMemo(() => {
    return søknader[0];
  }, [søknader]);

  return (
    <>
      {mellomlagretSøknad && (
        <Section>
          <div>
            <Heading level="2" size="medium" spacing>
              Vil du fortsette der du slapp?
            </Heading>
            <LinkPanel href="/aap/soknad/standard" border>
              <LinkPanel.Title>Søknad om arbeidsavklaringspenger</LinkPanel.Title>
              <LinkPanel.Description>
                Lagres til og med{' '}
                {format(new Date(mellomlagretSøknad.timestamp), 'EEEE dd.MM yy', {
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
              <BodyShort spacing>
                Mottatt{' '}
                {format(new Date(sisteSøknad.timestamp), 'dd.MM.yyyy hh:mm', { locale: nb })}
              </BodyShort>
              <BodyShort spacing>
                <Link href="#">Se forventet saksbehandlingstid</Link>
              </BodyShort>
              {sisteSøknad.missingDocuments.length > 0 && (
                <>
                  <Alert variant="warning">
                    Vi mangler dokumentasjon på {sisteSøknad.missingDocuments.join(', ')}
                  </Alert>
                  <Button variant="primary">Ettersend dokumentasjon</Button>
                </>
              )}
              <Heading level="3" size="small">
                Dokumentasjon vi har mottatt fra deg
              </Heading>
              <ul>
                <li>
                  <Link href={sisteSøknad.applicationPdf.url}>
                    Søknad om arbeidsavklaringspenger (AAP) mottatt{' '}
                    {format(new Date(sisteSøknad.applicationPdf.timestamp), 'dd.MM.yyyy hh:mm', {
                      locale: nb,
                    })}{' '}
                    (pdf)
                  </Link>
                </li>
                {sisteSøknad.documents.map((document) => (
                  <li key={document.title}>
                    <Link href={document.url}>
                      Vedlegg: {document.title} mottatt{' '}
                      {format(new Date(document.timestamp), 'dd.MM.yyyy hh:mm', {
                        locale: nb,
                      })}{' '}
                      ({document.type})
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
            <LinkPanel href="#" border key={dokument.tittel}>
              <LinkPanel.Title>{dokument.tittel}</LinkPanel.Title>
              <LinkPanel.Description>
                {intl.formatMessage('dokumentoversikt.mottatt')}{' '}
                {format(new Date(dokument.timestamp), 'dd.MM.yyyy hh:mm')}
              </LinkPanel.Description>
            </LinkPanel>
          ))}
        </PanelWithTopIcon>
      </Section>
    </>
  );
};

export const getServerSideProps = beskyttetSide(
  async (ctx): Promise<GetServerSidePropsResult<{}>> => {
    const søknader = await getSøknader();
    const dokumenter = await getDocuments();
    const mellomlagretSøknad = await getMellomlagretSøknad();

    return {
      props: { søknader, dokumenter, mellomlagretSøknad: mellomlagretSøknad ?? null },
    };
  }
);

export default Index;
