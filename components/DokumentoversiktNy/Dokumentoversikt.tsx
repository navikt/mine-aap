import { Detail, Link, Select, Table } from '@navikt/ds-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Dokument } from 'lib/types/types';
import styles from './Dokumentoversikt.module.css';
import { useEffect, useState } from 'react';

const getAvsender = (type: string) => {
  switch (type) {
    case 'I':
      return 'Deg';
    case 'U':
      return 'NAV';
    default:
      return 'Ukjent';
  }
};

export const Dokumentoversikt = ({ dokumenter }: { dokumenter: Dokument[] }) => {
  const [sorterteDokumenter, setSorterteDokumenter] = useState(dokumenter);
  const [sortType, setSortType] = useState('datoAsc');

  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortType(value);
  };

  useEffect(() => {
    if (sortType === 'datoAsc') {
      setSorterteDokumenter(
        [...dokumenter].sort((a, b) => new Date(b.dato).getTime() - new Date(a.dato).getTime())
      );
    }
    if (sortType === 'datoDesc') {
      setSorterteDokumenter(
        [...dokumenter].sort((a, b) => new Date(a.dato).getTime() - new Date(b.dato).getTime())
      );
    }
  }, [sortType, dokumenter]);

  return (
    <div className={styles.container}>
      <Select label="Sorter etter" onChange={onSortChange}>
        <option value="datoAsc">Nyeste først</option>
        <option value="datoDesc">Eldste først</option>
      </Select>
      <ul style={{ listStyle: 'none', margin: '0', padding: '0' }}>
        {sorterteDokumenter.map((document, index) => {
          return (
            <li
              key={`${document.journalpostId}-${document.dokumentId}`}
              style={{ marginBlock: '0.75rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Link
                    href={`/aap/mine-aap/api/dokument/?journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`}
                    target="_blank"
                  >
                    {document.tittel}
                  </Link>
                  <Detail style={{ color: 'var(--a-text-subtle' }}>
                    Sendt av: {getAvsender(document.type)}
                  </Detail>
                </div>
                <span style={{ whiteSpace: 'nowrap' }}>
                  {format(new Date(document.dato), 'dd.MMMM yyyy', { locale: nb })}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
