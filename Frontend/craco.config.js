module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Exclude node_modules from source-map-loader
      const sourceMapLoader = webpackConfig.module.rules.find((rule) =>
        rule.use && rule.use.some((use) => use.loader && use.loader.includes("source-map-loader"))
      );
      if (sourceMapLoader) {
        sourceMapLoader.exclude = /node_modules/;
      }
      return webpackConfig;
    },
  },
};