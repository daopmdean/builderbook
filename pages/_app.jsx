import PropTypes from 'prop-types';
import Header from '../components/Header';

const propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function MyApp(props)  {
  const { Component, pageProps } = props;

  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

MyApp.propTypes = propTypes;

export default MyApp;
