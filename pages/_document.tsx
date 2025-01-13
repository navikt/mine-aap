import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { fetchDecoratorReact, DecoratorFetchProps } from '@navikt/nav-dekoratoren-moduler/ssr';
import { DecoratorEnvProps } from '@navikt/nav-dekoratoren-moduler';

const decoratorEnv = process.env.DECORATOR_ENV as Exclude<DecoratorEnvProps['env'], 'localhost'>;

const decoratorParams: DecoratorFetchProps = {
  env: decoratorEnv ?? 'prod',
  serviceDiscovery: true,
  params: {
    context: 'privatperson',
    chatbot: false,
    feedback: false,
    logoutWarning: true,
  },
};

interface DocumentProps {
  Decorator: any;
}

class _Document extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const Decorator = await fetchDecoratorReact(decoratorParams);
    return { ...initialProps, Decorator };
  }

  render() {
    const { Decorator } = this.props;
    return (
      <Html>
        <Head>
          <meta name="robots" content="noindex,nofollow" />
          <link
            rel="preload"
            href="https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <Decorator.HeadAssets />
        </Head>

        <body>
          <Decorator.Header />
          <div id="app" className="app">
            <Main />
          </div>
          <Decorator.Footer />
          <Decorator.Scripts />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default _Document;
