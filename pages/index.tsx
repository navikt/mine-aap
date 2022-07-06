import { Attachment } from '@navikt/ds-icons';
import type { NextPage } from 'next';
import { PanelWithTopIcon } from '../components/PanelWithTopIcon/PanelWithTopIcon';
import { Section } from '../components/Section/Section';
import { useFeatureToggleIntl } from '../hooks/useFeatureToggleIntl';

const Home: NextPage = () => {
  const intl = useFeatureToggleIntl();

  return (
    <Section>
      <PanelWithTopIcon title={intl.formatMessage('dokumentoversikt.tittel')} icon={<Attachment />}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </PanelWithTopIcon>
    </Section>
  );
};

export default Home;
