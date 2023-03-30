import { Label } from '@navikt/ds-react';

import * as styles from './DocumentationHeading.module.css';

export const DocumentationHeading = ({ heading }: { heading: string }) => {
  return (
    <div className={`${styles.heading}`}>
      <Label size="small" as="p">
        {heading}
      </Label>
    </div>
  );
};
