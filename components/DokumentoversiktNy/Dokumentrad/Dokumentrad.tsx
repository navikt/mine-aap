import { Dokument } from 'lib/types/types';
import { Detail, Link } from '@navikt/ds-react';
import { formatDate } from 'lib/utils/date';

import styles from 'components/DokumentoversiktNy/Dokumentrad/Dokumentrad.module.css';
import { useTranslations } from 'next-intl';

type DokumentradProps = {
  dokument: Dokument;
};

const getAvsender = (type: string) => {
  switch (type) {
    case 'I':
      return 'deg';
    case 'U':
      return 'Nav';
    default:
      return 'Ukjent';
  }
};

export const Dokumentrad = ({ dokument }: DokumentradProps) => {
  const t = useTranslations('dokumentOversikt');
  return (
    <li className={styles.listItem}>
      <Link
        href={`/aap/mine-aap/api/dokument/${dokument.journalpostId}/${dokument.dokumentId}`}
        target="_blank"
        lang="no"
      >
        {dokument.tittel}
      </Link>
      <Detail style={{ color: 'var(--a-text-default' }}>
        {t('avsender', { name: getAvsender(dokument.type), date: formatDate(dokument.dato) })}
      </Detail>
    </li>
  );
};
