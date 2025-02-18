'use client';

import { Button } from '@navikt/ds-react';
import { useRouter } from 'i18n/routing';

export const ClientButton = ({ url, text }: { url: string; text: string }) => {
  const router = useRouter();
  return (
    <Button variant="secondary" onClick={() => router.push(url)}>
      {text}
    </Button>
  );
};
