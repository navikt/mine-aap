import { Detail, Link } from '@navikt/ds-react';
import { format } from 'date-fns';
import * as styles from './DocumentationList.module.css';

export const DocumentationList = ({
  elements,
}: {
  elements: { tittel: string; href?: string; innsendt?: Date }[];
}) => {
  return (
    <ul className={styles.list}>
      {elements.map((element, index) => (
        <li key={index} className={styles.listItem}>
          {element.href ? <Link href={element.href}>{element.tittel}</Link> : <>{element.tittel}</>}
          {element.innsendt && (
            <Detail className={styles.detail}>
              Mottatt: {format(element.innsendt, 'dd.MM.yyyy hh:MM')}
            </Detail>
          )}
        </li>
      ))}
    </ul>
  );
};
