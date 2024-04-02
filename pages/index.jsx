import { Button } from '@mui/material';
import Head from 'next/head';
import PropTypes from 'prop-types';

const propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
}

const defaultProps = {
  user: null,
}

const Index = ({ user }) => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Index page</title>
      <meta name="description" content="This is the description of the Index page" />
    </Head>
    
    <p>Content on Index page</p>

    <p>Email: {user.email} </p>

    <Button varient="contained">MUI button</Button>
  </div>
);

Index.getInitialProps = async (ctx) => ({ user: JSON.parse(ctx.query.user) });

Index.propTypes = propTypes;
Index.defaultProps = defaultProps;

export default Index;
