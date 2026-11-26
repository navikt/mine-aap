'use client';

import { onLanguageSelect, setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';
import { usePathname, useRouter } from 'i18n/routing';
import { useEffect } from 'react';

//TODO: avklare om dette er eneste alternative måten å fjerne innebygget språkvelger fra nav-dekoratoren
//TODO: Et alternativ er å gå over til ny brødsmulesti i gammel versjon av siden, slik at de kan bruke samme instans av dekoratør
export const NavDecorator = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setAvailableLanguages([
      {
        locale: 'nb',
        handleInApp: true,
      },
      {
        locale: 'nn',
        handleInApp: true,
      },
    ]);
  }, []);

  onLanguageSelect((language) => {
    router.push(pathname, { locale: language.locale });
  });

  return <>{children}</>;
};
