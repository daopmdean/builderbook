import PropTypes from 'prop-types';
import Link from 'next/link';
import { Avatar, Grid, Toolbar, Hidden, Button } from '@mui/material';
import { styleToolbar } from './SharedStyles';
import MenuWithAvatar from './MenuWithAvatar';

const optionsMenuCustomer = [
  {
    text: 'My books',
    href: '/customer/my-books',
    as: '/my-books',
  },
  {
    text: 'Log out',
    href: '/logout',
    anchor: true,
  },
];

 const optionsMenuAdmin = [
  {
    text: 'Admin',
    href: '/admin',
    as: '/admin',
  },
  {
    text: 'Log out',
    href: '/logout',
    anchor: true,
  },
];

const propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    displayName: PropTypes.string,
  }),
  hideHeader: PropTypes.bool,
};

const defaultProps = {
  user: null,
  hideHeader: false,
};

const Header = ({user, hideHeader, redirectUrl}) => (
  <div
    style={{
      overflow: 'hidden',
      position: 'relative',
      display: 'block',
      top: hideHeader ? '-64px' : '0px',
      transition: 'top 0.5s ease-in',
    }}
  >
    <Toolbar style={styleToolbar}>
      <Grid container direction="row" justifyContent="space-around" alignItems="center">
        <Grid item sm={9} xs={8} style={{ textAlign: 'left' }}>
          {user ? null : (
            <Link href="/">
              <Avatar 
                src="https://storage.googleapis.com/builderbook/logo.svg"
                alt="Builder Book logo"
                style={{ margin: '0px auto 0px 20px', cursor: 'pointer' }}
              />
            </Link>
          )}
        </Grid>
        <Grid item sm={2} xs={2} style={{ textAlign: 'right' }}>
          {user && user.isAdmin && !user.isGithubConnected ? (
            <Hidden mdDown>
              <Link href="/auth/github">
                <Button variant="contained" color="primary">
                  Connect Github
                </Button>
              </Link>
            </Hidden>
          ) : null}
        </Grid>
        <Grid item sm={1} xs={2} style={{ textAlign: 'right' }}>
          {user ? (
            <div style={{whiteSpace: 'nowrap' }}>
              {!user.isAdmin ? (
                <MenuWithAvatar
                  options={optionsMenuCustomer}
                  src={user.avatarUrl}
                  alt={user.displayName}
                />
              ) : null}
              {user.isAdmin ? (
                <MenuWithAvatar
                  options={optionsMenuAdmin}
                  src={user.avatarUrl}
                  alt={user.displayName}
                />
              ) : null}
            </div>
          ) : (
            <Link 
              href={{
                pathname: "/public/login",
                query: { redirectUrl },
              }} 
              as={{
                pathname: '/login',
                query: { redirectUrl },
              }}
              style={{ margin: '0px 20px 0px auto' }}
            >
              Log in
            </Link>
          )}
        </Grid>
      </Grid>
    </Toolbar>
  </div>
);

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
