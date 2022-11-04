import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { Components, Env, fetchDecoratorReact, Props } from '@navikt/nav-dekoratoren-moduler/ssr';

const decoratorEnv = process.env.DECORATOR_ENV as Exclude<Env, 'localhost'>;

const decoratorParams: Props = {
  env: decoratorEnv ?? 'prod',
  context: 'privatperson',
  chatbot: false,
  feedback: false,
  urlLookupTable: false,
};

class _Document extends Document<{ decorator: Components }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const decorator = await fetchDecoratorReact(decoratorParams);
    return { ...initialProps, decorator };
  }

  render() {
    const { Styles, Scripts, Header, Footer } = this.props.decorator;
    return (
      <Html>
        <Head>
          <meta name="robots" content="noindex,nofollow" />
        </Head>

        <body>
          <div id="app" className="app">
            <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default _Document;
