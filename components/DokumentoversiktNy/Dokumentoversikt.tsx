import styles from './Dokumentoversikt.module.css';
import { BodyShort, Checkbox, Detail, Link, Pagination, ReadMore, Select } from '@navikt/ds-react';
import { Dokument } from 'lib/types/types';
import { logDokumentoversiktEvent } from 'lib/utils/amplitude';
import { formatDate } from 'lib/utils/date';
import { getNumberOfPages, sortDatoAsc, sortDatoDesc } from 'lib/utils/dokumentOversikt';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const MELDEKORT_TITTEL = 'Meldekort for uke';

type SortType = 'datoAsc' | 'datoDesc';

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

const PAGE_SIZE = 7;

export const Dokumentoversikt = ({ dokumenter }: { dokumenter: Dokument[] }) => {
  const [sorterteDokumenter, setSorterteDokumenter] = useState(dokumenter);
  const [sortType, setSortType] = useState<SortType>('datoAsc');
  const [pageNumber, setPageNumber] = useState(1);
  const [hideMeldekort, setHideMeldekort] = useState(true);

  const intl = useIntl();

  const filtrerteDokumenter = useMemo(() => {
    return sorterteDokumenter.filter((dokument) => {
      if (dokument.tittel.includes(MELDEKORT_TITTEL)) {
        return !hideMeldekort;
      }
      return true;
    });
  }, [sorterteDokumenter, hideMeldekort]);

  const sortedPaginatedDocuments = useMemo(() => {
    const startIndex = (pageNumber - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return filtrerteDokumenter.slice(startIndex, endIndex);
  }, [filtrerteDokumenter, pageNumber]);

  const antallSider = useMemo(() => {
    return getNumberOfPages(filtrerteDokumenter, PAGE_SIZE);
  }, [filtrerteDokumenter]);

  const inneholderMeldekort = useMemo(() => {
    return sorterteDokumenter.some((dokument) => dokument.tittel.includes(MELDEKORT_TITTEL));
  }, [sorterteDokumenter]);

  useEffect(() => {
    const numberOfPages = getNumberOfPages(filtrerteDokumenter, PAGE_SIZE);
    if (pageNumber > numberOfPages) {
      setPageNumber(numberOfPages);
    }
  }, [filtrerteDokumenter, pageNumber]);

  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    logDokumentoversiktEvent(antallSider, `sorter etter ${value}`);
    setSortType(value as SortType);
  };

  useEffect(() => {
    if (sortType === 'datoAsc') {
      setSorterteDokumenter(sortDatoAsc(dokumenter));
    }
    if (sortType === 'datoDesc') {
      setSorterteDokumenter(sortDatoDesc(dokumenter));
    }
  }, [sortType, dokumenter]);

  if (sorterteDokumenter.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <Select
          label={intl.formatMessage({ id: 'dokumentOversikt.sorter.label' })}
          onChange={onSortChange}
          className={`${styles.select} ${!inneholderMeldekort && styles.noCheckbox}`}
        >
          <option value="datoAsc">
            <FormattedMessage id="dokumentOversikt.sorter.datoAsc" />
          </option>
          <option value="datoDesc">
            <FormattedMessage id="dokumentOversikt.sorter.datoDesc" />
          </option>
        </Select>
        {inneholderMeldekort && (
          <Checkbox
            checked={hideMeldekort}
            value={hideMeldekort}
            onChange={() => {
              logDokumentoversiktEvent(antallSider, 'toggle meldekort');
              setHideMeldekort(!hideMeldekort);
            }}
          >
            <FormattedMessage id="dokumentOversikt.visMeldekort" />
          </Checkbox>
        )}
      </div>
      <ul className={styles.documentList}>
        {sortedPaginatedDocuments.map((document) => {
          return (
            <li
              key={`${document.journalpostId}-${document.dokumentId}`}
              className={styles.listItem}
            >
              <div className={styles.content}>
                <span>
                  <Link
                    href={`/aap/mine-aap/api/dokument/?journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`}
                    target="_blank"
                    onClick={() => logDokumentoversiktEvent(antallSider, 'klikk lenke')}
                    lang="no"
                  >
                    {document.tittel}
                  </Link>
                </span>
                <Detail style={{ color: 'var(--a-text-default' }}>
                  <FormattedMessage
                    id="dokumentOversikt.avsender"
                    values={{ name: getAvsender(document.type), date: formatDate(document.dato) }}
                  />
                </Detail>
              </div>
            </li>
          );
        })}
      </ul>
      {antallSider > 1 && (
        <Pagination
          page={pageNumber}
          onPageChange={(x) => {
            setPageNumber(x);
            logDokumentoversiktEvent(antallSider, 'pagination');
          }}
          count={antallSider}
          size="small"
        />
      )}
    </div>
  );
};
