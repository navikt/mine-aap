'use client';

import { Button } from '@navikt/ds-react';

export const ClientButton = ({ url, text }: { url: string; text: string }) => {
  return (
    <Button variant="secondary" onClick={() => (window.location.href = url)}>
      {text}
    </Button>
  );
};
