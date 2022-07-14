import { Attachment, Information } from '@navikt/ds-icons';
import { BodyShort, Heading, Link, LinkPanel } from '@navikt/ds-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { beskyttetSideUtenProps } from '../auth/beskyttetSide';
import { PanelWithTopIcon } from '../components/PanelWithTopIcon/PanelWithTopIcon';
import { Section } from '../components/Section/Section';
import { useFeatureToggleIntl } from '../hooks/useFeatureToggleIntl';
import { Dokument } from './api/dokumentoversikt';
import { MellomlagretSøknad } from './api/mellomlagretSoknad';

const Index: NextPage = () => {
  const intl = useFeatureToggleIntl();

  const [dokumenter, setDokumenter] = useState<Dokument[]>([]);
  const [mellomlagretSøknad, setMellomlagretSøknad] = useState<MellomlagretSøknad | undefined>(
    undefined
  );

  useEffect(() => {
    fetch('api/dokumentoversikt/')
      .then((res) => res.json())
      .then((data) => setDokumenter(data));
  }, []);

  useEffect(() => {
    fetch('api/mellomlagretSoknad/')
      .then((res) => res.json())
      .then((data) => setMellomlagretSøknad(data));
  }, []);

  return (
    <>
      {mellomlagretSøknad && (
        <Section>
          <div>
            <Heading level="2" size="large" spacing>
              Vil du fortsette der du slapp?
            </Heading>
            <LinkPanel href="#" border>
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

export const getServerSideProps = beskyttetSideUtenProps;

export default Index;
