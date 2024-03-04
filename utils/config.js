require("dotenv").config();

const config = {
  get nodeEnv() {
    return process.env.NODE_ENV;
  },
  get devEnv() {
    return process.env.DEV_ENV;
  },
  get port() {
    return process.env.PORT || 5000;
  },
  get mongoUri() {
    return process.env.MONGO_URI;
  },
  get unmarshalApiKey() {
    return process.env.UNMARSHAL_API_KEY;
  },
  get baseBitcoinUrl() {
    return process.env.BASE_BITCOIN_API;
  },
  get btcWalletAddress() {
    return process.env.BTC_WALLET_ADDRESS;
  },
  get sslPrivateKey() {
    return process.env.SSL_PRIV_KEY;
  },
  get sslFullchainKey() {
    return process.env.SSL_FULLCHAIN_KEY;
  },
};

module.exports = config;
