// import * as LodashModuleReplacementPlugin from "lodash-webpack-plugin";
// let LodashModuleReplacementPlugin;
// LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
module.exports = {
  lintOnSave: true,
  pluginOptions: {
    electronBuilder: {
      externals: ["carlo"],
      customFileProtocol: "app://./",
      // customFileProtocol: 'file://./',
      baseUrl: "app://./",
      removeElectronJunk: true,
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        appId: "me.axiong.vcptronexp.app",
        productName: "vcptronexp",
        artifactName: "${productName}.${ext}",
        compression: "store",
        mac: {
          category: "public.app-category.business",
          target: "default"
        },
        nsis: {
          oneClick: false,
          perMachine: true,
          allowToChangeInstallationDirectory: true
        },
        win: {
          target: [
            {
              target: "nsis",
              arch: ["x64", "ia32"]
            }
          ]
        },
        linux: {
          target: "AppImage"
        },
        publish: [
          {
            provider: "generic",
            url: "http://localhost:8008/",
            channel: "latest"
          }
        ]
      }
    }
  }
};
