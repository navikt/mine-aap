import { Attachment, Information } from '@navikt/ds-icons';
import { BodyShort, Link, LinkPanel } from '@navikt/ds-react';
import { format } from 'date-fns';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { PanelWithTopIcon } from '../components/PanelWithTopIcon/PanelWithTopIcon';
import { Section } from '../components/Section/Section';
import { useFeatureToggleIntl } from '../hooks/useFeatureToggleIntl';
import { Dokument } from './api/dokumentoversikt';

const Home: NextPage = () => {
  const intl = useFeatureToggleIntl();

  const [dokumenter, setDokumenter] = useState<Dokument[]>([]);

  useEffect(() => {
    fetch('api/dokumentoversikt')
      .then((res) => res.json())
      .then((data) => setDokumenter(data));
  }, []);

  return (
    <Section>
      <PanelWithTopIcon title={intl.formatMessage('dineOppgaver.tittel')} icon={<Information />}>
        <BodyShort spacing>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</BodyShort>
      </PanelWithTopIcon>
      <PanelWithTopIcon title={intl.formatMessage('hvaGjorVi.tittel')} icon={<Information />}>
        <BodyShort spacing>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</BodyShort>
      </PanelWithTopIcon>
      <PanelWithTopIcon title={intl.formatMessage('dokumentoversikt.tittel')} icon={<Attachment />}>
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
  );
};

export default Home;
