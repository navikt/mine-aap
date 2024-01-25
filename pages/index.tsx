import { getSøknader, getSøknaderInnsending } from './api/soknader/soknader';
import { beskyttetSide, getAccessToken } from '@navikt/aap-felles-utils';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { Card } from 'components/Card/Card';
import { DokumentoversiktContainer } from 'components/DokumentoversiktNy/DokumentoversiktContainer';
import { ForsideIngress } from 'components/Forside/Ingress/ForsideIngress';
import { NyttigÅVite } from 'components/NyttigÅVite/NyttigÅVite';
import { PageComponentFlexContainer } from 'components/PageComponentFlexContainer/PageComponentFlexContainer';
import { PageContainer } from 'components/PageContainer/PageContainer';
import { Soknad } from 'components/Soknad/Soknad';
import { SoknadInnsending } from 'components/SoknadInnsending/SoknadInnsending';
import { isAfter, isBefore, sub } from 'date-fns';
import metrics from 'lib/metrics';
import { InnsendingSøknad, Søknad } from 'lib/types/types';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const Index = ({
  søknader,
  sisteSøknadInnsending,
}: {
  søknader: Søknad[];
  sisteSøknadInnsending?: InnsendingSøknad;
}) => {
  const { formatMessage } = useIntl();

  const router = useRouter();

  const sisteSøknad = useMemo(() => {
    return søknader[0];
  }, [søknader]);

  useEffect(() => {
    if (sisteSøknad != undefined && sisteSøknad.innsendtDato != undefined) {
      const erEldreEnn14Uker = isBefore(new Date(sisteSøknad.innsendtDato), sub(new Date(), { weeks: 14 }));
      if (erEldreEnn14Uker) {
        setTimeout(() => {
          // @ts-ignore-line
          if (typeof window.hj === 'function') {
            // @ts-ignore-line
            window?.hj('trigger', 'aap_brev_undersokelse');
          } else {
            console.log('hotjar ble ikke lastet inn i tide :(');
          }
        }, 1000);
      } else {
        console.log('Siste søknad er ikke eldre enn 14 uker');
      }
    }
  }, [sisteSøknad]);

  return (
    <PageContainer>
      <Head>
        <title>
          {`${formatMessage(
            { id: 'appTittel' },
            {
              shy: '',
            }
          )} - nav.no`}
        </title>
      </Head>
      <PageComponentFlexContainer>
        <Heading level="1" size="large" spacing>
          <FormattedMessage id="appTittel" values={{ shy: <>&shy;</> }} />
        </Heading>
        <ForsideIngress>
          <FormattedMessage id="appIngress" />
        </ForsideIngress>
      </PageComponentFlexContainer>
      {sisteSøknadInnsending && (
        <PageComponentFlexContainer subtleBackground>
          <Heading level="2" size="medium" spacing>
            <FormattedMessage id="minSisteSøknad.heading" />
          </Heading>
          <Card>
            <SoknadInnsending søknad={sisteSøknadInnsending} />
          </Card>
        </PageComponentFlexContainer>
      )}
      {sisteSøknad && !sisteSøknadInnsending && (
        <PageComponentFlexContainer subtleBackground>
          <Heading level="2" size="medium" spacing>
            <FormattedMessage id="minSisteSøknad.heading" />
          </Heading>
          <Card>
            <Soknad søknad={sisteSøknad} />
          </Card>
        </PageComponentFlexContainer>
      )}
      {!sisteSøknad && !sisteSøknadInnsending && (
        <>
          <DokumentoversiktContainer />
          <PageComponentFlexContainer>
            <Heading level="2" size="medium" spacing>
              <FormattedMessage id="forside.ettersendelse.tittel" />
            </Heading>
            <Card subtleBlue>
              <BodyShort spacing>
                <FormattedMessage id="forside.ettersendelse.tekst" />
              </BodyShort>
              <Button variant="secondary" onClick={() => router.push('/ettersendelse')}>
                <FormattedMessage id="forside.ettersendelse.knapp" />
              </Button>
            </Card>
          </PageComponentFlexContainer>
        </>
      )}
      <PageComponentFlexContainer>
        <NyttigÅVite />
      </PageComponentFlexContainer>
      <PageComponentFlexContainer>
        <Heading level="2" size="medium" spacing>
          <FormattedMessage id="forside.endretSituasjon.heading" />
        </Heading>
        <Card subtleBlue>
          <BodyShort spacing>
            <FormattedMessage id="forside.endretSituasjon.tekst" />
          </BodyShort>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = 'https://innboks.nav.no/s/skriv-til-oss?category=Arbeid')}
          >
            <FormattedMessage id="forside.endretSituasjon.knapp" />
          </Button>
        </Card>
      </PageComponentFlexContainer>
      {(sisteSøknad || sisteSøknadInnsending) && <DokumentoversiktContainer />}
    </PageContainer>
  );
};

export const getServerSideProps = beskyttetSide(async (ctx: NextPageContext): Promise<GetServerSidePropsResult<{}>> => {
  const stopTimer = metrics.getServersidePropsDurationHistogram.startTimer({ path: '/' });
  const bearerToken = getAccessToken(ctx);
  const params = { page: '0', size: '1', sort: 'created,desc' };

  const søknader = await getSøknader(params, bearerToken);
  const innsendingSøknader: InnsendingSøknad[] = await getSøknaderInnsending(bearerToken);

  const sortedByMottattDato = innsendingSøknader.sort((a, b) =>
    isAfter(new Date(a.mottattDato), new Date(b.mottattDato)) ? -1 : 1
  );

  const sisteSøknadInnsending = sortedByMottattDato[0];

  stopTimer();

  return {
    props: { søknader, sisteSøknadInnsending },
  };
});

export default Index;
