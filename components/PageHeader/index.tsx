import React from 'react';
import { Heading } from '@navikt/ds-react';
import * as classes from 'components/PageHeader/PageHeader.module.css';

export interface PageHeaderProps {
  children: string | React.ReactNode;
}

export const PageHeader = ({ children }: PageHeaderProps) => {
  return (
    <div className={classes.pageHeaderWrapper}>
      <div className={`${classes.navdsPageHeader} ${classes.navdsPageHeaderGuide} ${classes.navdsPageHeaderCenter}`}>
        <Heading size="xlarge" level="1">
          {children}
        </Heading>
      </div>
    </div>
  );
};
