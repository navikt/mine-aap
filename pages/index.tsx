import { Attachment, Information } from '@navikt/ds-icons';
import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  Heading,
  Label,
  Link,
  LinkPanel,
  Panel,
} from '@navikt/ds-react';
import type { GetServerSidePropsResult, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { getAccessToken } from '../auth/accessToken';
import { beskyttetSide } from '../auth/beskyttetSide';
import { VerticalFlexContainer } from '../components/FlexContainer/VerticalFlexContainer';
import { Layout } from '../components/Layout/Layout';
import { PanelWithTopIcon } from '../components/PanelWithTopIcon/PanelWithTopIcon';
import { Section } from '../components/Section/Section';
import { useFeatureToggleIntl } from '../hooks/useFeatureToggleIntl';
import { Dokument, MellomlagretSøknad, Søknad } from '../types/types';
import { formatFullDate } from '../utils/date';
import { getDocuments } from './api/dokumentoversikt';
import { getMellomlagredeSøknader } from './api/mellomlagredeSoknader';
import { getSøknader } from './api/soknader';
import logger from '../utils/logger';

interface PageProps {
  søknader: Søknad[];
  dokumenter: Dokument[];
  mellomlagredeSøknader: MellomlagretSøknad[];
}

const Index = ({ søknader, dokumenter, mellomlagredeSøknader }: PageProps) => {
  const { formatMessage } = useFeatureToggleIntl();

  const router = useRouter();

  const sisteSøknad = useMemo(() => {
    return søknader[0];
  }, [søknader]);

  const sisteMellomlagredeSøknad = useMemo(() => {
    return mellomlagredeSøknader[0];
  }, [mellomlagredeSøknader]);

  return (
    <Layout>
      {/*sisteMellomlagredeSøknad && (
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
              )*/}

      {sisteSøknad && (
        <Section lightBlue>
          <div>
            <Heading level="2" size="medium" spacing>
              {formatMessage('sisteSøknad.heading')}
            </Heading>
            <Panel border>
              <Heading level="3" size="small">
                {formatMessage('sisteSøknad.søknad.heading')}
              </Heading>
              <BodyShort spacing>
                {formatMessage('sisteSøknad.søknad.mottatt', {
                  date: formatFullDate(sisteSøknad.innsendtDato),
                })}
              </BodyShort>
              <BodyShort spacing>
                <Link href="#">{formatMessage('sisteSøknad.søknad.saksbehandlingstid')}</Link>
              </BodyShort>
              {(sisteSøknad.manglendeVedlegg?.length ?? 0) > 0 && (
                <Alert variant="warning">
                  {formatMessage('sisteSøknad.søknad.alert.message', {
                    missingDocuments: sisteSøknad.manglendeVedlegg?.join(', '),
                  })}
                </Alert>
              )}
              <Button
                variant="primary"
                onClick={() => router.push(`/${sisteSøknad.søknadId}/ettersendelse/`)}
              >
                {formatMessage('sisteSøknad.søknad.button.text')}
              </Button>
              <Heading level="3" size="small">
                {formatMessage('sisteSøknad.dokumentasjon.heading')}
              </Heading>
              <ul>
                {sisteSøknad.innsendteVedlegg?.map((document) => (
                  <li key={`${document.vedleggType}-${document.innsendtDato}`}>
                    {formatMessage('sisteSøknad.dokumentasjon.vedlegg', {
                      date: formatFullDate(document.innsendtDato),
                      type: document.vedleggType,
                    })}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
          {søknader.length > 0 && (
            <NextLink href="/soknader" passHref>
              <Link>Se alle dine innsendte søknader</Link>
            </NextLink>
          )}
        </Section>
      )}

      <Section>
        <Panel border>
          <Heading level="2" size="medium" spacing>
            Vi har mottatt søknaden din, hva skjer nå?
          </Heading>
          <ul>
            <li>
              <Label>Vi sjekker om vi har nok helseopplysninger</Label>
              <BodyLong spacing>
                Hvis vi har behov for flere helseopplysninger, vil vi bruke informasjonen du ga oss
                i søknaden til å bestille dette fra lege eller annen behandler.
              </BodyLong>
            </li>
            <li>
              <Label>Vi vurderer mulighetene og begrensningene dine i møte med arbeidslivet</Label>
              <BodyLong spacing>
                Du har krav på en vurdering av hvilken oppfølging du trenger fra NAV for å komme i
                eller beholde arbeid (folketrygdloven §14a). Vi bruker da legeerklæringen og
                opplysningene du har gitt oss til å se på mulighetene dine til å jobbe. Hvis vi
                trenger det, tar vi kontakt med deg for å få mer informasjon om situasjonen din. Du
                får et brev med vurderingen vår. Hvis du ikke er enig i den,{' '}
                <Link href="#">bør du klage på oppfølgingsvedtaket</Link>.
              </BodyLong>
            </li>
            <li>
              <Label>Hva kan du gjøre?</Label>
              <BodyLong spacing>
                Det er til hjelp for oss om du registrerer{' '}
                <Link href="#">CV-en din på arbeidsplassen.no</Link>. Husk å laste opp vedlegg. Gi
                beskjed hvis noe endrer seg.
              </BodyLong>
            </li>
            <li>
              <Label>Vi sjekker om du har rett på AAP</Label>
              <BodyLong spacing>
                Til sist sjekker vi om du har rett på AAP etter folketrygdloven kapittel 11. Vi
                bruker her opplysningene vi har fått i forbindelse med søknaden.
              </BodyLong>
            </li>
            <li>
              <Label>Svar på AAP-søknaden</Label>
              <BodyLong spacing>
                Du får et vedtak med vurderingen vår av om du har rett på AAP eller ikke. Her står
                det også hvor mye du vil få utbetalt. Hvis du ikke er enig,{' '}
                <Link href="#">bør du klage på AAP-vedtaket</Link>.
              </BodyLong>
              <BodyLong spacing>
                Du har rett til oppfølgning fra NAV uansett om du får innvilget AAP eller ikke.
              </BodyLong>
            </li>
          </ul>
        </Panel>

        <Panel border>
          <Heading level="2" size="medium" spacing>
            {formatMessage('dokumentoversikt.tittel')}
          </Heading>
          <BodyShort spacing>
            <Link href="#">{formatMessage('dokumentoversikt.ikkeSynligDokumentLink')}</Link>
          </BodyShort>
          <VerticalFlexContainer>
            {dokumenter.map((dokument) => (
              <LinkPanel href={dokument.url} border key={dokument.tittel}>
                <LinkPanel.Title>{dokument.tittel}</LinkPanel.Title>
                <LinkPanel.Description>
                  {formatMessage('dokumentoversikt.mottatt')} {formatFullDate(dokument.timestamp)}
                </LinkPanel.Description>
              </LinkPanel>
            ))}
          </VerticalFlexContainer>
        </Panel>
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

    logger.info(`søknader: ${JSON.stringify(søknader)}`);

    return {
      props: { søknader, dokumenter, mellomlagredeSøknader },
    };
  }
);

export default Index;
