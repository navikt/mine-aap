import { Dokument } from 'lib/types/types';
import { logDokumentoversiktEvent } from 'lib/utils/amplitude';
import { Detail, Link } from '@navikt/ds-react';
import { FormattedMessage } from 'react-intl';
import { formatDate } from 'lib/utils/date';

import styles from 'components/DokumentoversiktNy/Dokumentrad/Dokumentrad.module.css';

type DokumentradProps = {
  dokument: Dokument;
  antallSider: number;
};

const getAvsender = (type: string) => {
  switch (type) {
    case 'I':
      return 'deg';
    case 'U':
      return 'NAV';
    default:
      return 'Ukjent';
  }
};

export const Dokumentrad = ({ dokument, antallSider }: DokumentradProps) => (
  <li className={styles.listItem}>
    <Link
      href={`/aap/mine-aap/api/dokument/${dokument.journalpostId}/${dokument.dokumentId}`}
      target="_blank"
      onClick={() => logDokumentoversiktEvent(antallSider, 'klikk lenke')}
      lang="no"
    >
      {dokument.tittel}
    </Link>
    <Detail style={{ color: 'var(--a-text-default' }}>
      <FormattedMessage
        id="dokumentOversikt.avsender"
        values={{ name: getAvsender(dokument.type), date: formatDate(dokument.dato) }}
      />
    </Detail>
  </li>
);
