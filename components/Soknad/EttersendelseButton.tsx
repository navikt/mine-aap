'use client';

import { Button } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';

export const EttersendelseButton = ({ innsendingsId, knappeTekst }: { innsendingsId: string; knappeTekst: string }) => {
  const router = useRouter();
  return (
    <Button variant="primary" onClick={() => router.push(`/${innsendingsId}/ettersendelse/`)}>
      {knappeTekst}
    </Button>
  );
};
