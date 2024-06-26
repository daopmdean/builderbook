const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSessionStore = require("connect-mongo");

const setupGoogle = require("./google");
const { setupGithub } = require("./github");
const { insertTemplates } = require("./models/EmailTemplate");
const api = require("./api/v1");
const routesWithSlug = require("./routesWithSlug");
const { stripeCheckoutCallback } = require("./stripe");
const setupSitemapAndRobots = require("./sitemapAndRobots");
const getRootURL = require("../lib/api/getRootUrl");
const logger = require("./logger");
const helmet = require("helmet");

require("dotenv").config();

const dev = process.env.NODE_ENV != "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = parseInt(process.env.PORT, 10) || 8000;
const ROOT_URL = getRootURL();
const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;

mongoose.connect(MONGO_URL);

const URL_MAP = {
  "/login": "/public/login",
  "/my-books": "/customer/my-books",
};

app.prepare().then(async () => {
  const server = express();

  server.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
  );
  server.use(express.json());

  server.get("/_next/*", (req, res) => {
    handle(req, res);
  });

  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    store: mongoSessionStore.create({
      mongoUrl: MONGO_URL,
      ttl: 14 * 24 * 60 * 60,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      domain: "localhost",
    },
  };

  const sessionMiddleware = session(sessionOptions);
  server.use(sessionMiddleware);

  await insertTemplates();

  setupGoogle({ ROOT_URL, server });
  setupGithub({ ROOT_URL, server });
  stripeCheckoutCallback({ server });
  setupSitemapAndRobots({ server });
  api(server);
  routesWithSlug({ server, app });

  server.get("*", (req, res) => {
    const url = URL_MAP[req.path];
    if (url) {
      app.render(req, res, url);
    } else {
      handle(req, res);
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    logger.info(`listen on ${ROOT_URL}`);
  });
});
