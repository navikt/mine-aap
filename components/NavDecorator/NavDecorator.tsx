'use client';

import {
  onBreadcrumbClick,
  onLanguageSelect,
  setAvailableLanguages,
  setBreadcrumbs,
} from '@navikt/nav-dekoratoren-moduler';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'i18n/routing';
import React, { useEffect } from 'react';

const BASE_PATH = '/aap/mine-aap/';

export const NavDecorator = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations('breadcrumbs');
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

  useEffect(() => {
    const breadcrumbs = [{ title: t('mineAAP'), url: BASE_PATH, handleInApp: true }];
    if (pathname.endsWith('ettersendelse/')) {
      breadcrumbs.push({
        title: t('ettersending'),
        url: pathname,
        handleInApp: true,
      });
    }
    if (pathname.endsWith('soknader/')) {
      breadcrumbs.push({
        title: t('mineAAPSoknader'),
        url: pathname,
        handleInApp: true,
      });
    }
    setBreadcrumbs(breadcrumbs);
  }, [router, t, pathname]);

  onBreadcrumbClick((breadcrumb) => {
    router.push(breadcrumb.url.replace(BASE_PATH, '/'));
  });

  return <>{children}</>;
};
