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
    },
    {
      name: "prod",
      script:  "./dist/backend/src/app.js",
      env: {
        NODE_ENV: "production",
        ...envs,
      },
    },
  ],
};
