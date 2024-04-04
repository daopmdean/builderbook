import Head from "next/head";
import withAuth from "../lib/withAuth";
import { Button } from "@mui/material";
import { styleLoginButton } from "../components/SharedStyles";


const Login = () => (
  <div style={{ textAlign: 'center', marghin: '0 20px' }}>
    <Head>
      <title>Login Page</title>
      <meta name="description" content="Login page for demo builderbook.org" />
    </Head>
    <br/>
    <p style={{ margin: '45px auto', fontSize: '44px', fontWeight: '400' }}>Login</p>
    <p>You’ll be logged in for 14 days unless you log out manually.</p>
    <br />
    <Button variant="contained" style={styleLoginButton} href="/auth/google">
      <img
        src="https://storage.googleapis.com/builderbook/G.svg"
        alt="Log in with Google"
        style={{ marginRight: '10px' }}
      />
      Login with Google
    </Button>
  </div>
);

export default withAuth(Login, {logoutRequired: true});