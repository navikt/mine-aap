import React, { PropsWithChildren, ReactElement } from 'react';
import Script from 'next/script';
import parse from 'html-react-parser';

import { DecoratorFetchProps } from 'lib/decorator/decorator-types';

import { getDecoratorBlocks, getDecoratorMetadata } from 'lib/decorator/fetch-decorator';
import { logInfo } from '@navikt/aap-felles-utils';

export interface DecoratorProps {
  decoratorProps: DecoratorFetchProps;
}

export const Decorator = async ({ children, decoratorProps }: PropsWithChildren<DecoratorProps>) => {
  const t1 = performance.now();
  const [{ scripts, styles, inlineScripts, language }, { header, footer }] = await Promise.all([
    getDecoratorMetadata(decoratorProps),
    getDecoratorBlocks(decoratorProps),
  ]);
  logInfo(`Decorator fetched in ${performance.now() - t1}ms`);

  return (
    <html lang={language ?? 'nb'}>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {styles.map((it) => (
          <link key={it} rel="stylesheet" href={it} />
        ))}
      </head>
      <body>
        {parse(header)}
        {children}
        {parse(footer)}
        {inlineScripts.map((it) => (
          <div key={it} dangerouslySetInnerHTML={{ __html: it }} />
        ))}
        {scripts.map((it) => (
          <Script key={it} src={it} />
        ))}
      </body>
    </html>
  );
};
