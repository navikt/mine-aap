import styles from './Section.module.css';

export interface SectionProps {
  children: React.ReactNode;
}

export const Section = ({ children }: SectionProps) => {
  <section className={styles.section}>{children}</section>;
};
