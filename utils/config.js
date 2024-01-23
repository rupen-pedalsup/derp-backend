require("dotenv").config();

const config = {
  get nodeEnv() {
    return process.env.NODE_ENV;
  },
  get devEnv() {
    return process.env.DEV_ENV;
  },
  get port() {
    return process.env.PORT;
  },
  get mongoUri() {
    return process.env.MONGO_URI;
  },
  get unmarshalApiKey() {
    return process.env.UNMARSHAL_API_KEY;
  },
  get sslPrivateKey() {
    return process.env.SSL_PRIV_KEY;
  },
  get sslFullchainKey() {
    return process.env.SSL_FULLCHAIN_KEY;
  },
};

module.exports = config;
