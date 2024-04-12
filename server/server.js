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

require("dotenv").config();

const port = parseInt(process.env.PORT, 10) || 8000;
const ROOT_URL = `http://localhost:${port}`;
const MONGO_URL = process.env.MONGO_URL_TEST;

mongoose.connect(MONGO_URL);

const dev = process.env.NODE_ENV != "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const URL_MAP = {
  "/login": "/public/login",
  "/my-books": "/customer/my-books",
};

app.prepare().then(async () => {
  const server = express();
  server.use(express.json());

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
    console.log(`listen on ${ROOT_URL}`);
  });
});
