import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '../components/Layout/Layout';
import { useEffect } from 'react';
import { initAmplitude } from '../utils/amplitude';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initAmplitude();
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
