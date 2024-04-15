import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import Header from '../components/Header';
import { theme } from '../lib/theme';
import Notifier from '../components/Notifier';

Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

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
          <link rel="stylesheet" href="https://storage.googleapis.com/async-await/nprogress-light-spinner.css"/>
        </Head>
        <CssBaseline />
        {pageProps.chapter ? null : <Header {...pageProps} />}
        <Component {...pageProps} />
        <Notifier />
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = propTypes;

export default MyApp;
