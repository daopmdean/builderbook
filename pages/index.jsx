import { Button } from '@mui/material';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { Component } from 'react';

import withAuth from '../lib/withAuth';
import notify from '../lib/notify';

const propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
}

const defaultProps = {
  user: null,
}

class Index extends Component {
  render() {
    const {user} = this.props;

    return (
    <div style={{ padding: '10px 45px' }}>
      <Head>
        <title>Index page</title>
        <meta name="description" content="This is the description of the Index page" />
      </Head>
      
      <p>Content on Index page</p>

      <p>Email: {user.email} </p>

      <Button varient="contained" onClick={() => notify('well click message')}>MUI button</Button>
    </div>
    );
  };
};


Index.propTypes = propTypes;
Index.defaultProps = defaultProps;

export default withAuth(Index);
