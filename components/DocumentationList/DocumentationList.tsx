import * as styles from './DocumentationList.module.css';
import { Detail, Link } from '@navikt/ds-react';
import { formatDate } from 'lib/utils/date';
import { FormattedMessage } from 'react-intl';

export const DocumentationList = ({
  elements,
}: {
  elements: { tittel: string; href?: string; innsendt?: string }[];
}) => {
  return (
    <ul className={styles.list}>
      {elements.map((element, index) => (
        <li key={index} className={styles.listItem}>
          {element.href ? (
            <>
              <Link href={element.href} target="_blank" lang="no">
                {element.tittel}
              </Link>
            </>
          ) : (
            <span lang="no">{element.tittel}</span>
          )}
          {element.innsendt && (
            <Detail className={styles.detail}>
              <FormattedMessage id="minSisteSøknad.mottatt" values={{ date: formatDate(element.innsendt) }} />
            </Detail>
          )}
        </li>
      ))}
    </ul>
  );
};
