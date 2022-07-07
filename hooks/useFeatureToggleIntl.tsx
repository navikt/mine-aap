import { useIntl } from 'react-intl';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

export const useFeatureToggleIntl = () => {
  const intl = useIntl();
  const router = useRouter();
  const [hostname, setHostname] = useState<string>('');
  const searchParams = router.query;
  const isShowKeys = useMemo(() => Object.keys(searchParams).includes('showKeys'), [searchParams]);
  useEffect(
    () =>
      setHostname(
        window?.location?.hostname === 'localhost' ? 'dev.nav.no' : window.location.hostname
      ),
    []
  );

  const formatMessage = (id: string, values?: Record<string, string | undefined>) =>
    isShowKeys
      ? `${id}:${intl.formatMessage({ id: id }, values)}`
      : intl.formatMessage({ id: id }, values);
  const formatElement = (id: string, values?: Record<string, string | undefined> | undefined) =>
    isShowKeys ? (
      <>
        {id}:{intl.formatMessage({ id: id }, values)}
      </>
    ) : (
      intl.formatMessage({ id: id }, values)
    );
  const formatLink = (id: string) =>
    isShowKeys
      ? `${id}:${intl.formatMessage({ id: `applinks.${id}` }, { hostname })}`
      : intl.formatMessage({ id: `applinks.${id}` }, { hostname });
  return { formatMessage, formatElement, formatLink };
};
