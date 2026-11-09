import type { BehandlingsHendelse } from 'lib/services/apiInternService';

export interface HendelseStegProps {
  hendelse: BehandlingsHendelse;
  open: boolean;
  onToggle: () => void;
  dateFormatter: Intl.DateTimeFormat;
}
