import { Label } from '@navikt/ds-react';
import * as styles from './DocumentationHeading.module.css';

export const DocumentationHeading = ({
  heading,
  orangeBackground,
}: {
  heading: string;
  orangeBackground?: boolean;
}) => {
  return (
    <div className={`${styles.heading} ${orangeBackground && styles.orange}`}>
      <Label size="small" as="p">
        {heading}
      </Label>
    </div>
  );
};
