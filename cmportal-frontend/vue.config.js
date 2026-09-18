const { secureCookiesProxy } = import('http-proxy-middleware-secure-cookies');
module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar'
  ],
  // Same-origin in development, exactly like production: the browser talks only
  // to the dev server and /api is forwarded to the PHP backend. Without this the
  // app ran cross-origin, which meant CORS preflights and - because fetch only
  // sends cookies same-origin by default - a silently empty basket, favourites
  // and mailbox.
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:83',
        changeOrigin: false
      }
    }
  }
}
