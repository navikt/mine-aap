import { BodyShort, Heading } from '@navikt/ds-react';
import React, { HTMLAttributes, forwardRef, useMemo } from 'react';

import * as classes from 'components/PageHeader/PageHeader.module.css';

export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * PageHeader title
   */
  children: string | React.ReactNode;
  /**
   * Pictogram placed in PageHeader
   */
  illustration?: React.ReactNode;
  /**
   * Short text placed under title
   */
  description?: string;
  /**
   * Predefined variants for PageHeader
   * @default "guide"
   */
  variant?: 'situation' | 'product' | 'guide';
  /**
   * Decides how to align content
   * @default "left"
   */
  align?: 'left' | 'center';
}

// eslint-disable-next-line react/display-name
const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ children, className, illustration, description, variant = 'guide', align = 'left', ...rest }, ref) => {
    const variantClass = useMemo(() => {
      switch (variant) {
        case 'situation':
          return 'navdsPageHeaderSituation';
        case 'product':
          return 'navdsPageHeaderProduct';
        default:
          return 'navdsPageHeaderGuide';
      }
    }, [variant]);
    const alignClass = useMemo(() => {
      switch (align) {
        case 'center':
          return 'navdsPageHeaderCenter';
        default:
          return 'navdsPageHeaderLeft';
      }
    }, [align]);
    return (
      <div className={classes?.pageHeaderWrapper}>
        <div
          ref={ref}
          className={`${classes?.navdsPageHeader} ${className} ${classes?.[variantClass]} ${classes?.[alignClass]}`}
          {...rest}
        >
          {illustration && <div className={classes?.navdsPageHeaderIllustration}>{illustration}</div>}
          <div className="navdsPageHeaderWrapper">
            <Heading className="navdsPageHeaderTitle" size="xlarge" level="1">
              {children}
            </Heading>
            {description && <BodyShort className="navdsPageHeaderDescription">{description}</BodyShort>}
          </div>
        </div>
      </div>
    );
  }
);

export default PageHeader;
