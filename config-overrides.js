const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.plugins.forEach((plugin) => {
        if (plugin instanceof ModuleScopePlugin) {
          plugin.allowedFiles.add(path.resolve("./config.json"));
        }
      });
      return webpackConfig;
    },
  },
};
