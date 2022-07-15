import styles from './Section.module.css';

export interface SectionProps {
  lightBlue?: boolean;
  children: React.ReactNode;
}

export const Section = ({ lightBlue, children }: SectionProps) => (
  <section className={`${styles.section} ${lightBlue && styles.lightBlueBackground}`}>
    <div className={styles.container}>{children}</div>
  </section>
);
