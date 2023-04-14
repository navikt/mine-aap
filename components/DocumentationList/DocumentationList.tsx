import * as styles from './DocumentationList.module.css';
import { Detail, Link } from '@navikt/ds-react';
import { format } from 'date-fns';
import { formatDate } from 'lib/utils/date';

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
            <Link href={element.href} target="_blank">
              {element.tittel}
            </Link>
          ) : (
            <>{element.tittel}</>
          )}
          {element.innsendt && (
            <Detail className={styles.detail}>Mottatt: {formatDate(element.innsendt)}</Detail>
          )}
        </li>
      ))}
    </ul>
  );
};
