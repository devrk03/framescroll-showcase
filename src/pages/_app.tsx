// src/pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ImageProvider } from '../contexts/ImageContext';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ImageProvider>
      <Head>
        <title>Parallax Vision</title>
        <meta name="description" content="Experience the magic of scrolling with Parallax Vision" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ImageProvider>
  );
}

export default MyApp;
