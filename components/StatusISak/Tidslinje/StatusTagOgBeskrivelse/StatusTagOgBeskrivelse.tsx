import { ClockIcon } from '@navikt/aksel-icons';
import { BodyShort, Tag } from '@navikt/ds-react';
import type { BehandlingHendelseNavn } from 'lib/types/apiinternTypes';
import { useTranslations } from 'next-intl';
import styles from './StatusTagOgBeskrivelse.module.css';
import { type StatusTagStatus, statusConfig } from './statusConfig';

export type { StatusTagStatus } from './statusConfig';

export interface StatusTagOgBeskrivelseProps {
  navn: BehandlingHendelseNavn;
  status?: StatusTagStatus | null;
}

export function StatusTagOgBeskrivelse({ navn, status }: StatusTagOgBeskrivelseProps) {
  const t = useTranslations('statusisak');

  if (!status) {
    return null;
  }

  const visning = statusConfig[navn][status];

  if (!visning || (!visning.tag && !visning.beskrivelse)) {
    return null;
  }

  return (
    <div className={styles.container}>
      {visning.tag && (
        <Tag
          className={styles.tag}
          variant="neutral"
          icon={visning.showClockIcon ? <ClockIcon aria-hidden /> : undefined}
        >
          {t(visning.tag)}
        </Tag>
      )}
      {visning.beskrivelse && <BodyShort className={styles.beskrivelse}>{t(visning.beskrivelse)}</BodyShort>}
    </div>
  );
}
