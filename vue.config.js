const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap: process.env.NODE_ENV !== 'production',
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/ToneAPI_webclient/' : '/',
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Players : Tone API'
    },
    server: {
      entry: 'src/main.ts',
      template: 'public/servers.html',
      filename: 'servers.html',
      title: 'Servers : Tone API'
    }
  }
})
