const webpack = require('webpack');
// Initialize doteenv library
require('dotenv').config();

module.exports = {
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };
    /**
     * Returns environment variables as an object
     */
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});

    /** Allows you to create global constants which can be configured
     * at compile time, which in our case is our environment variables
     */
    config.plugins.push(new webpack.DefinePlugin(env));

    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

// module.exports = {
//   env: {
//     ENV: process.env.NODE_ENV,
//     MY_API: 'hello',
//   },
// };
