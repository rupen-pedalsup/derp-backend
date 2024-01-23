const app = require("./app");
const https = require("https");
const constants = require("./utils/constants");
const fs = require("fs");
const {
  devEnv,
  port,
  sslPrivateKey,
  sslFullchainKey,
} = require("./utils/config");
const dbConnect = require("./db");

const startServer = () => {
  let serverConfig = devEnv;
  let httpsServer;

  // spin up the https server in case of not local env
  if (serverConfig !== constants.LOCAL_DEV_ENV) {
    httpsServer = https.createServer(
      {
        key: fs.readFileSync(sslPrivateKey),
        cert: fs.readFileSync(sslFullchainKey),
      },
      app,
    );
  }

  // start the respective server
  if (serverConfig === constants.LOCAL_DEV_ENV) {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } else if (
    serverConfig === constants.STAGING_DEV_ENV ||
    serverConfig === constants.PROD_DEV_ENV
  ) {
    httpsServer.listen(port, () => {
      console.log(`HTTPS Server running on port ${port}`);
    });
  }
};

dbConnect(startServer);
