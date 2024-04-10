import PropTypes from 'prop-types';
import Link from 'next/link';
import { Avatar, Grid, Toolbar } from '@mui/material';
import { styleToolbar } from './SharedStyles';
import MenuWithAvatar from './MenuWithAvatar';

const optionsMenu = [
  {
    text: 'Got question?',
    href: 'https://github.com/async-labs/builderbook/issues',
  },
  {
    text: 'Logout',
    href: '/logout',
    anchor: true,
  }
]

const propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    displayName: PropTypes.string,
  }),
};

const defaultProps = {
  user: null,
};

const Header = ({user}) => (
  <div>
    <Toolbar style={styleToolbar}>
      <Grid container direction="row" justifyContent="space-around" alignItems="center">
        <Grid item sm={11} xs={9} style={{ textAlign: 'left' }}>
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
        <Grid item sm={1} xs={3} style={{ textAlign: 'right' }}>
          {user ? (
            <div style={{whiteSpace: 'nowrap' }}>
              {user.avatarUrl ? (
                <MenuWithAvatar 
                  options={optionsMenu}
                  src={user.avatarUrl}
                  alt={user.displayName}
                />
                ) : null}
            </div>
          ) : (
            <Link href="/public/login" as='/login' style={{ margin: '0px 20px 0px auto' }}>
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
