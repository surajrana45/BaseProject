const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true
  /* devServer: {
    proxy: {
      "/api": {
        target: "http://api.indianwebtool.com/",
      },
      "/user": {
        target: "http://api.indianwebtool.com/",
        pathRewrite: { "^/User": "/api" },
      },
    },
  }, */
});
