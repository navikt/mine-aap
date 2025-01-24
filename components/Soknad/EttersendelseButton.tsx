'use client';

import { Button } from '@navikt/ds-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'i18n/routing';

export const EttersendelseButton = ({ innsendingsId }: { innsendingsId: string }) => {
  const t = useTranslations('minSisteSøknad.søknad');
  const router = useRouter();
  return (
    <Button variant="primary" onClick={() => router.push(`/${innsendingsId}/ettersendelse/`)}>
      {t('button.text')}
    </Button>
  );
};
