import { Heading, Panel } from '@navikt/ds-react';
import styles from './PanelWithTopIcon.module.css';

export interface PanelWithTopIconProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const PanelWithTopIcon = ({ title, icon, children }: PanelWithTopIconProps) => {
  return (
    <Panel border className={styles.panelContainer}>
      <div className={styles.icon}>{icon}</div>
      <Heading level="2" size="medium" spacing>
        {title}
      </Heading>
      {children}
    </Panel>
  );
};
