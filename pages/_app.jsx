import PropTypes from 'prop-types';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import Header from '../components/Header';
import { theme } from '../lib/theme';
import Head from 'next/head';

const propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function MyApp(props)  {
  const { Component, pageProps } = props;

  return (
    <CacheProvider value={createCache({key: 'css' })}>
      <ThemeProvider theme={theme}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <CssBaseline />
        <Header {...pageProps} />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = propTypes;

export default MyApp;
