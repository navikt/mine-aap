import { Checkbox, Detail, Link, Pagination, Select } from '@navikt/ds-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Dokument } from 'lib/types/types';
import { logDokumentoversiktEvent } from 'lib/utils/amplitude';
import { useEffect, useMemo, useState } from 'react';

import styles from './Dokumentoversikt.module.css';

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

const PAGE_SIZE = 5;

const getNumberOfPages = (dokumenter: Dokument[], pageSize: number) => {
  return Math.ceil(dokumenter.length / pageSize);
};

export const Dokumentoversikt = ({ dokumenter }: { dokumenter: Dokument[] }) => {
  const [sorterteDokumenter, setSorterteDokumenter] = useState(dokumenter);
  const [sortType, setSortType] = useState('datoAsc');
  const [pageNumber, setPageNumber] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [visMeldekort, setVisMeldekort] = useState(true);

  const filtrerteDokumenter = useMemo(() => {
    return sorterteDokumenter.filter((dokument) => {
      if (searchFilter) {
        return (
          !dokument.tittel.toLowerCase().includes(searchFilter.toLowerCase()) ||
          getAvsender(dokument.type).toLowerCase().includes(searchFilter.toLowerCase())
        );
      }
      return true;
    });
  }, [sorterteDokumenter, searchFilter]);

  const sortedPaginatedDocuments = useMemo(() => {
    const startIndex = (pageNumber - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return filtrerteDokumenter.slice(startIndex, endIndex);
  }, [filtrerteDokumenter, pageNumber]);

  const antallSider = useMemo(() => {
    return getNumberOfPages(filtrerteDokumenter, PAGE_SIZE);
  }, [filtrerteDokumenter]);

  useEffect(() => {
    const numberOfPages = getNumberOfPages(filtrerteDokumenter, PAGE_SIZE);
    if (pageNumber > numberOfPages) {
      setPageNumber(numberOfPages);
    }
  }, [filtrerteDokumenter, pageNumber]);

  useEffect(() => {
    if (visMeldekort) {
      setSearchFilter('Meldekort for uke');
    } else {
      setSearchFilter('');
    }
  }, [visMeldekort]);

  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    logDokumentoversiktEvent(antallSider, `sorter etter ${value}`);
    setSortType(value);
  };

  useEffect(() => {
    if (sortType === 'datoAsc') {
      setSorterteDokumenter([...dokumenter].sort((a, b) => new Date(b.dato).getTime() - new Date(a.dato).getTime()));
    }
    if (sortType === 'datoDesc') {
      setSorterteDokumenter([...dokumenter].sort((a, b) => new Date(a.dato).getTime() - new Date(b.dato).getTime()));
    }
  }, [sortType, dokumenter]);

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Select label="Sorter etter" onChange={onSortChange}>
          <option value="datoAsc">Nyeste først</option>
          <option value="datoDesc">Eldste først</option>
        </Select>
        {/*<Search
          label="Søk i dokumentoversikten"
          onChange={(value) => setSearchFilter(value)}
          onClear={() => setSearchFilter('')}
          hideLabel={false}
  />*/}
        <Checkbox value={visMeldekort} checked={!visMeldekort} onChange={() => setVisMeldekort(!visMeldekort)}>
          Vis meldekort
        </Checkbox>
      </div>
      <ul style={{ listStyle: 'none', margin: '0', padding: '0' }}>
        {sortedPaginatedDocuments.map((document) => {
          return (
            <li key={`${document.journalpostId}-${document.dokumentId}`} className={styles.listItem}>
              <div className={styles.content}>
                <span>
                  <Link
                    href={`/aap/mine-aap/api/dokument/?journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`}
                    target="_blank"
                    onClick={() => logDokumentoversiktEvent(antallSider, 'klikk lenke')}
                  >
                    {document.tittel}
                  </Link>
                </span>
                <Detail style={{ color: 'var(--a-text-default' }}>
                  Sendt av {getAvsender(document.type)} den{' '}
                  {format(new Date(document.dato), 'dd. MMMM yyyy', { locale: nb })}
                </Detail>
              </div>
            </li>
          );
        })}
      </ul>
      <Pagination
        page={pageNumber}
        onPageChange={(x) => {
          setPageNumber(x);
          logDokumentoversiktEvent(antallSider, 'pagination');
        }}
        count={antallSider}
        size="small"
      />
    </div>
  );
};
