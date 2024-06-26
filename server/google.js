const passport = require("passport");
const { OAuth2Strategy } = require("passport-google-oauth");

const User = require("./models/User");
const logger = require("./logger");

function setupGoogle({ ROOT_URL, server }) {
  const verify = async (accessToken, refreshToken, profile, verified) => {
    let email;
    let avatarUrl;

    if (profile.emails) {
      email = profile.emails[0].value;
    }

    if (profile.photos && profile.photos.length > 0) {
      avatarUrl = profile.photos[0].value.replace("sz=50", "sz=128");
    }

    try {
      const user = await User.signInOrSignUp({
        googleId: profile.id,
        email,
        googleToken: { accessToken, refreshToken },
        displayName: profile.displayName,
        avatarUrl,
      });
      verified(null, user);
    } catch (err) {
      verified(err);
      logger.info(err);
    }
  };

  passport.use(
    new OAuth2Strategy(
      {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENTSECRET,
        callbackURL: `${ROOT_URL}/oauth2callback`,
      },
      verify
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, User.publicFields())
      .then((user) => {
        done(null, user);
      })
      .catch((error) => {
        done(error, null);
      });
  });

  server.use(passport.initialize());
  server.use(passport.session());

  server.get("/auth/google", (req, res, next) => {
    if (
      req.query &&
      req.query.redirectUrl &&
      req.query.redirectUrl.startsWith("/")
    ) {
      req.session.finalUrl = req.query.redirectUrl;
    } else {
      req.session.finalUrl = null;
    }

    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    })(req, res, next);
  });

  server.get(
    "/oauth2callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      if (req.user && req.user.isAdmin) {
        res.redirect("/admin");
      } else if (req.session.finalUrl) {
        res.redirect(`${ROOT_URL}${req.session.finalUrl}`);
      } else {
        res.redirect("/my-books");
      }
    }
  );

  server.get("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err);
      }

      res.redirect("/login");
    });
  });
}

module.exports = setupGoogle;
