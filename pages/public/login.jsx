import Head from "next/head";
import { withRouter } from 'next/router';
import { Button } from "@mui/material";
import PropTypes from 'prop-types';

import { styleLoginButton } from "../../components/SharedStyles";
import withAuth from "../../lib/withAuth";

const propTypes = {
  router: PropTypes.shape({
    query: PropTypes.shape({
      redirectUrl: PropTypes.string,
    }),
  }).isRequired,
};

const Login = ({router}) => {
  const redirectUrl = (router && router.query && router.query.redirectUrl) || '';
  
  return <div style={{ textAlign: 'center', marghin: '0 20px' }}>
    <Head>
      <title>Login Page</title>
      <meta name="description" content="Login page for demo builderbook.org" />
    </Head>
    <br/>
    <p style={{ margin: '45px auto', fontSize: '44px', fontWeight: '400' }}>Login</p>
    <p>You’ll be logged in for 14 days unless you log out manually.</p>
    <br />
    <Button 
      variant="contained" 
      style={styleLoginButton} 
      href={`/auth/google?redirectUrl=${redirectUrl}`}
    >
      <img
        src="https://storage.googleapis.com/builderbook/G.svg"
        alt="Log in with Google"
        style={{ marginRight: '10px' }}
      />
      Login with Google
    </Button>
  </div>
};

Login.propTypes = propTypes;

export default withAuth(withRouter(Login), {logoutRequired: true});
