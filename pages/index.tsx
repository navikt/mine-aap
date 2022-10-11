import {
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
import NextLink from 'next/link';
import { useMemo } from 'react';
import { getAccessToken } from 'lib/auth/accessToken';
import { beskyttetSide } from 'lib/auth/beskyttetSide';
import { VerticalFlexContainer } from 'components/FlexContainer/VerticalFlexContainer';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';
import { SoknadPanel } from 'components/SoknadPanel/SoknadPanel';
import { useFeatureToggleIntl } from 'lib/hooks/useFeatureToggleIntl';
import { Dokument, MellomlagretSøknad, Søknad } from 'lib/types/types';
import { formatFullDate } from 'lib/utils/date';
import { getDocuments } from 'pages/api/dokumentoversikt';
import { getSøknader } from 'pages/api/soknader/soknader';
import { logger } from '@navikt/aap-felles-innbygger-utils';
import { useRouter } from 'next/router';

interface PageProps {
  søknader: Søknad[];
  dokumenter: Dokument[];
}

const Index = ({ søknader, dokumenter }: PageProps) => {
  const { formatMessage } = useFeatureToggleIntl();

  const router = useRouter();

  const sisteSøknad = useMemo(() => {
    return søknader[0];
  }, [søknader]);

  return (
    <Layout>
      {sisteSøknad && (
        <Section lightBlue>
          <div>
            <Heading level="2" size="medium" spacing>
              {formatMessage('sisteSøknad.heading')}
            </Heading>
            <SoknadPanel søknad={sisteSøknad} />
          </div>
          {søknader.length > 0 && (
            <div>
              <NextLink href="/soknader" passHref>
                <Link>Se alle dine innsendte søknader</Link>
              </NextLink>
            </div>
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

        <Heading level="2" size="medium">
          Er det noe du vil melde fra om til oss?
        </Heading>
        <Panel border>
          <Label spacing>Ettersending</Label>
          <BodyShort spacing>
            Er det noe du vil ettersende til oss om din AAP sak Da kan du gjøre det her.
          </BodyShort>
          <Button variant="secondary" onClick={() => router.push('/ettersendelse')}>
            Ettersend dokumenter
          </Button>
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
    const params = { page: '0', size: '1', sort: 'created,desc' };
    const søknader = await getSøknader(params, bearerToken);
    const dokumenter = await getDocuments();

    logger.info(`søknader: ${JSON.stringify(søknader)}`);

    return {
      props: { søknader, dokumenter },
    };
  }
);

export default Index;
