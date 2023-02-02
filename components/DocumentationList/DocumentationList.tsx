import * as styles from './DocumentationList.module.css';

export const DocumentationList = ({ elements }: { elements: string[] }) => {
  return (
    <ul className={styles.list}>
      {elements.map((element, index) => (
        <li key={index} className={styles.listItem}>
          {element}
        </li>
      ))}
    </ul>
  );
};
