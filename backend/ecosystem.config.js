const dotenv = require("dotenv");
dotenv.config();

const envs = process.env;

module.exports = {
  apps: [
    {
      name: "dev",
      script: "./dist/backend/src/app.js",
      env: {
        NODE_ENV: "development",
        ...envs,
      },
      watch: true,
    },
    {
      name: "prod",
      script: "./dist/backend/src/app.js",
      env: {
        NODE_ENV: "production",
        MAINNET_NETWORK_ADDRESS: "0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef",
        MAINNET_BETACOLONY_ADDRESS:
          "0x869814034d96544f3C62DE2aC22448ed79Ac8e70",
        MAINNET_PROJECT_ID: "18dbb283acf34eba9b1f7346626a5802",
        ...envs,
      },
      watch: true,
    },
  ],
};
