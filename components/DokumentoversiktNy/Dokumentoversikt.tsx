'use client';

import styles from './Dokumentoversikt.module.css';
import { Checkbox, Pagination, Select } from '@navikt/ds-react';
import { Dokument } from 'lib/types/types';
import { logDokumentoversiktEvent } from 'lib/utils/amplitude';
import { getNumberOfPages, sortDatoAsc, sortDatoDesc } from 'lib/utils/dokumentOversikt';
import { useEffect, useMemo, useState } from 'react';
import { Dokumentrad } from 'components/DokumentoversiktNy/Dokumentrad/Dokumentrad';
import { useTranslations } from 'next-intl';

const MELDEKORT_TITTEL = 'Meldekort for uke';

type SortType = 'datoAsc' | 'datoDesc';

const PAGE_SIZE = 7;

export const Dokumentoversikt = ({ dokumenter }: { dokumenter: Dokument[] }) => {
  const [sorterteDokumenter, setSorterteDokumenter] = useState(dokumenter);
  const [sortType, setSortType] = useState<SortType>('datoAsc');
  const [pageNumber, setPageNumber] = useState(1);
  const [hideMeldekort, setHideMeldekort] = useState(true);

  const t = useTranslations('dokumentOversikt');

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
          label={t('sorter.label')}
          onChange={onSortChange}
          className={`${styles.select} ${!inneholderMeldekort && styles.noCheckbox}`}
        >
          <option value="datoAsc">{t('sorter.datoAsc')}</option>
          <option value="datoDesc">{t('sorter.datoDesc')}</option>
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
            {t('visMeldekort')}
          </Checkbox>
        )}
      </div>
      <ul className={styles.documentList}>
        {sortedPaginatedDocuments.map((document) => (
          <Dokumentrad
            dokument={document}
            antallSider={antallSider}
            key={`${document.journalpostId}-${document.dokumentId}`}
          />
        ))}
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
