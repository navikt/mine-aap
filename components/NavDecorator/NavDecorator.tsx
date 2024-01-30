import {
  onBreadcrumbClick,
  onLanguageSelect,
  setAvailableLanguages,
  setBreadcrumbs,
} from '@navikt/nav-dekoratoren-moduler';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

export const NavDecorator = ({ children }: { children: React.ReactNode }) => {
  const { formatMessage } = useIntl();

  const router = useRouter();
  const { pathname, asPath, query } = router;

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
    router.push({ pathname, query }, asPath, { locale: language.locale });
  });

  useEffect(() => {
    const breadcrumbs = [
      { title: formatMessage({ id: 'breadcrumbs.mineAAP' }), url: router.basePath, handleInApp: true },
    ];
    if (router.asPath.endsWith('ettersendelse/')) {
      breadcrumbs.push({
        title: formatMessage({ id: 'breadcrumbs.ettersending' }),
        url: router.asPath,
        handleInApp: true,
      });
    }
    if (router.asPath.endsWith('soknader/')) {
      breadcrumbs.push({
        title: formatMessage({ id: 'breadcrumbs.mineAAPSoknader' }),
        url: router.asPath,
        handleInApp: true,
      });
    }
    setBreadcrumbs(breadcrumbs);
  }, [router, formatMessage]);

  onBreadcrumbClick((breadcrumb) => {
    router.push(breadcrumb.url.replace(router.basePath, '/'));
  });

  return <>{children}</>;
};
