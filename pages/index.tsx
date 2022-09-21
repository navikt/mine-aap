import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  GuidePanel,
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
import logger from 'lib/utils/logger';
import { useRouter } from 'next/router';
import { Dokumentoversikt } from 'components/Dokumentoversikt/Dokumentoversikt';

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
      <Section>
        <GuidePanel poster>
          <Heading level="2" size="medium" spacing>
            Velkommen til Mine AAP!
          </Heading>
          <BodyShort spacing>
            På denne siden finner du:
            <ul>
              <li>Mulighet for å ettersende dokumenter til søknad og sak</li>
              <li>
                Mulighet for å gi beskjed om endringer og gi oss opplysninger du mener er viktig for
                saken din
              </li>
              <li>
                En oversikt over alle dine dokumenter som er knyttet til arbeidsavklaringspenger
              </li>
            </ul>
          </BodyShort>

          <BodyShort spacing>
            Denne siden er under utvikling, og vil bli utvidet med flere funksjoner etter hvert.
          </BodyShort>
        </GuidePanel>
      </Section>
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

      {!sisteSøknad && (
        <Section>
          <Dokumentoversikt dokumenter={dokumenter} />
          <Panel border>
            <Label spacing>Ettersending</Label>
            <BodyShort spacing>
              Er det noe du vil ettersende til oss om din AAP sak Da kan du gjøre det her.
            </BodyShort>
            <Button variant="secondary" onClick={() => router.push('/ettersendelse')}>
              Ettersend dokumenter
            </Button>
          </Panel>
        </Section>
      )}

      <Section>
        <Panel>
          <Heading level="2" size="medium" spacing>
            Vi har mottatt søknaden din, hva skjer nå?
          </Heading>
          <ul>
            <li>
              <Label as={'p'}>Vi sjekker om vi har nok helseopplysninger</Label>
              <BodyLong spacing>
                Hvis vi har behov for flere helseopplysninger, vil vi bruke informasjonen du ga oss
                i søknaden til å bestille legeerklæring fra lege eller annen behandler.
              </BodyLong>
            </li>
            <li>
              <Label as={'p'}>
                Vi vurderer mulighetene og begrensningene dine i møte med arbeidslivet
              </Label>
              <BodyLong spacing>
                Du har krav på en vurdering av hvilken oppfølging du trenger fra NAV for å komme i
                eller beholde arbeid (folketrygdloven §14a). Vi bruker helseopplysninger og
                opplysningene du har gitt oss til å se på mulighetene dine. Hvis vi trenger det, tar
                vi kontakt med deg. Du får et brev med vurderingen vår. Hvis du har spørsmål kan du
                ta kontakt med oss. Hvis du ikke er enig i vurderingen,{' '}
                <Link href="https://www.nav.no/soknader/nb/person/arbeid/arbeidsavklaringspenger/NAV%2011-13.05/klage-eller-anke/brev">
                  kan du klage på oppfølgingsvedtaket
                </Link>
                .
              </BodyLong>
            </li>
            <li>
              <Label as={'p'}>Hva kan du gjøre?</Label>
              <BodyLong spacing>
                Det er til hjelp for oss om du:
                <ul>
                  <li>
                    Registrerer{' '}
                    <Link href="https://arbeidsplassen.nav.no/">
                      CV-en din på arbeidsplassen.no
                    </Link>
                  </li>
                  <li>Husker å ettersende dokumenter som mangler</li>
                  <li>Gir beskjed hvis situasjoen din endrer seg</li>
                </ul>
              </BodyLong>
            </li>
            <li>
              <Label as={'p'}>Vi sjekker om du har rett på AAP</Label>
              <BodyLong spacing>
                Til sist sjekker vi om du har rett på AAP etter folketrygdloven kapittel 11. Vi
                bruker her opplysningene vi har fått i forbindelse med søknaden.
              </BodyLong>
            </li>
            <li>
              <Label as={'p'}>Svar på AAP-søknaden</Label>
              <BodyLong spacing>
                Du får et vedtak med vurderingen vår av om du har rett på AAP eller ikke, og hvor
                mye du vil få utbetalt. Hvis du har spørsmål til vurderingen, kan du ta kontakt med
                oss. Hvis du ikke er enig,{' '}
                <Link href="https://www.nav.no/soknader/nb/person/arbeid/arbeidsavklaringspenger/NAV%2011-13.05/klage-eller-anke/brev">
                  kan du klage på AAP-vedtaket
                </Link>
                .
              </BodyLong>
              <BodyLong spacing>
                Du har rett til oppfølgning fra NAV uansett om du får innvilget AAP eller ikke.
              </BodyLong>
            </li>
          </ul>
        </Panel>

        <Panel border>
          <Heading level="2" size="medium" spacing>
            Vil du melde fra om en endring i din situasjon?
          </Heading>

          <BodyShort spacing>
            Her kan du gi beskjed om endringer og gi oss opplysninger du mener er viktig for saken
            din. Hvis du har en aktivitetsplan, benytter du denne.
          </BodyShort>
          <Button
            variant="secondary"
            onClick={() =>
              (window.location.href = 'https://innboks.nav.no/s/skriv-til-oss?category=Arbeid')
            }
          >
            Meld endring
          </Button>
        </Panel>

        {sisteSøknad && <Dokumentoversikt dokumenter={dokumenter} />}
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
