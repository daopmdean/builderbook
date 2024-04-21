import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import PropTypes from 'prop-types';

import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';

const propTypes = {
  styles: PropTypes.arrayOf(
    PropTypes.string || PropTypes.number || PropTypes.ReactElementLike || PropTypes.ReactFragment,
  ).isRequired,
};

class MyDocument extends Document {
  static getInitialProps = async (ctx) => {
    const originalRenderPage = ctx.renderPage;

    const cache = createCache({ 
      key: 'css', 
      prepend: true,
    });
    const { extractCriticalToChunks } = createEmotionServer(cache);
    
    ctx.renderPage = () => 
      originalRenderPage({
        enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />,
      });
    
    const initialProps = await Document.getInitialProps(ctx);
    const chunks = extractCriticalToChunks(initialProps.html);

    const emotionStyleTags = chunks.styles.map((style) => (
      <style 
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
    };
  };


  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="google" content="notranslate" />
          <meta name="theme-color" content="#1976D2" />

          <link
            rel="shortcut icon"
            href="https://storage.googleapis.com/builderbook/favicon32.png"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400:latin"
          />
          <link
            rel="stylesheet"
            href="https://storage.googleapis.com/builderbook/nprogress.min.css"
          />
          <link rel="stylesheet" href="https://storage.googleapis.com/builderbook/vs.min.css" />
          <link
            rel="stylesheet"
            href="https://storage.googleapis.com/builderbook/nprogress.min.css"
          />
          <link rel="stylesheet" href="/fonts/server.css" />

          <style>
            {`
             a {
                font-weight: 400;
                color: #58a6ff;
                text-decoration: none;
                outline: none;
              }
              blockquote {
                padding: 0 1em;
                color: #555;
                border-left: 0.25em solid #dfe2e5;
              }
              pre {
                display: block;
                overflow-x: auto;
                padding: 0.5em;
                background: #FFF;
                border: 1px solid #ddd;
                font-size: 14px;
              }
              code {
                font-size: 14px;
                background: #FFF;
                padding: 3px 5px;
              }
            `}
          </style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
