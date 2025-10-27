import { GuidePanel } from '@navikt/ds-react';
import React from 'react';

import { Luca } from './Luca';

export interface LucaGuidePanelProps {
  children: React.ReactNode;
}

export const LucaGuidePanel = ({ children }: LucaGuidePanelProps) => (
  <GuidePanel illustration={<Luca />} poster>
    {children}
  </GuidePanel>
);
