'use client';

import { faro } from '@grafana/faro-web-sdk';
import { BodyShort, Heading, HStack, Link, List, VStack } from '@navikt/ds-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

//500 Page
// biome-ignore lint/suspicious/noShadowRestrictedNames: <Component name is nextjs standard>
const Error = ({ error }: { error: Error }) => {
  const t = useTranslations();

  useEffect(() => {
    faro.api?.pushError(error);
  }, [error]);

  return (
    <HStack paddingBlock={'0 7'} justify={'center'}>
      <VStack>
        <Heading level="1" size="large" spacing>
          {t('errorpage.error.heading')}
        </Heading>
        <BodyShort size={'large'} spacing>
          {t('errorpage.error.description')}
        </BodyShort>
        <BodyShort size={'large'}>{t('errorpage.error.bulletList.title')}</BodyShort>
        <List size={'large'}>
          <List.Item>
            {t.rich('errorpage.error.bulletList.items.1', {
              a: (chunks) => (
                <Link href="#" onClick={() => location.reload()}>
                  {chunks}
                </Link>
              ),
            })}
          </List.Item>
          <List.Item>
            {t.rich('errorpage.error.bulletList.items.2', {
              a: (chunks) => <Link href={'/aap/mine-aap'}>{chunks}</Link>,
            })}
          </List.Item>
        </List>
        <BodyShort size={'large'} spacing>
          {t.rich('errorpage.error.vedvarer', {
            a: (chunks) => (
              <Link href="https://www.nav.no/kontaktoss" target="_blank">
                {chunks}
              </Link>
            ),
          })}
        </BodyShort>
      </VStack>
    </HStack>
  );
};

export default Error;
