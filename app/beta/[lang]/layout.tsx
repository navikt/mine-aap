import { Decorator } from 'components/decorator/Decorator';
import { DecoratorLocale } from 'lib/decorator/decorator-types';
import { ReactElement } from 'react';

export const generateStaticParams = async () => {
  return [{ lang: 'nb' }, { lang: 'nn' }];
};

interface Props {
  children: ReactElement;
  params: {
    lang: DecoratorLocale;
  };
}

const Root = async ({ children, params }: Props) => {
  return (
    <>
      {/* @ts-ignore-line TODO: Se på hvorfor typescript ikke liker returtypen her. */}
      <Decorator
        decoratorProps={{
          env: 'devNext',
          params: {
            breadcrumbs: [{ url: 'https://nav.no/aap/mine-aap', title: 'Mine Arbeidsavklaringspenger' }],
            language: params.lang,
            ssr: true,
          },
        }}
      >
        <main>{children}</main>
      </Decorator>
    </>
  );
};

export default Root;
