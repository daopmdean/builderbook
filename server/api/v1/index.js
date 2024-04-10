const adminApi = require("./admin");
const customerApi = require("./customer");
const publicApi = require("./public");

function api(server) {
  server.use("/api/v1/admin", adminApi);
  server.use("/api/v1/customer", customerApi);
  server.use("/api/v1/public", publicApi);
}

module.exports = api;
