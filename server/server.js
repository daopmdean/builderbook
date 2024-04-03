const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const User = require("./models/User");

require("dotenv").config();

const port = parseInt(process.env.PORT, 10) || 8000;
const ROOT_URL = `http://localhost:${port}`;
const MONGO_URL = process.env.MONGO_URL_TEST;

mongoose.connect(MONGO_URL);

const dev = process.env.NODE_ENV != "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("/", async (req, res) => {
    const user = JSON.stringify(
      await User.findOne({ slug: "team-builder-book" }).lean()
    );
    app.render(req, res, "/", { user });
  });

  server.get("*", (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`listen on ${ROOT_URL}`);
  });
});
