import {
  setAvailableLanguages,
  setBreadcrumbs,
  onLanguageSelect,
  onBreadcrumbClick,
} from '@navikt/nav-dekoratoren-moduler';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

export const NavDecorator = ({ children }: { children: React.ReactNode }) => {
  const intl = useIntl();

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
      {
        title: intl.formatMessage({ id: 'breadcrumbs.mineAAP' }),
        url: router.basePath,
        handleInApp: true,
      },
    ];
    if (router.asPath.endsWith('ettersendelse/')) {
      breadcrumbs.push({
        title: intl.formatMessage({ id: 'breadcrumbs.ettersending' }),
        url: router.asPath,
        handleInApp: true,
      });
    }
    if (router.asPath.endsWith('soknader/')) {
      breadcrumbs.push({
        title: intl.formatMessage({ id: 'breadcrumbs.mineAAPSoknader' }),
        url: router.asPath,
        handleInApp: true,
      });
    }
    setBreadcrumbs(breadcrumbs);
  }, [router, intl.formatMessage]);

  onBreadcrumbClick((breadcrumb) => {
    // TODO: Bedre logikk for breadcrumbs
    router.push(breadcrumb.url.replace(router.basePath, '/'));
  });

  return <>{children}</>;
};
