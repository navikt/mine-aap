'use client';

import { Link } from '@navikt/ds-react';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface Props {
  breadcrumbItems: BreadcrumbItem[];
}

export const Breadcrumbs = ({ breadcrumbItems }: Props) => {
  return (
    <nav className={styles.breadcrumb} aria-label="breadcrumb">
      <ol className={styles.breadcrumbList}>
        {breadcrumbItems.map(({ href, label }) => (
          <li className={styles.breadcrumbItem} key={href}>
            <Link className={styles.link} href={href}>
              {label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};
