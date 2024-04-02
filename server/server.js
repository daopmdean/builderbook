const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 8000;
const ROOT_URL = `http://localhost:${port}`;

const dev = process.env.NODE_ENV != "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("/", (req, res) => {
    const user = JSON.stringify({ email: "team@builderbook.org" });
    app.render(req, res, "/", { user });
  });

  server.get("*", (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`listen on ${ROOT_URL}`);
  });
});
