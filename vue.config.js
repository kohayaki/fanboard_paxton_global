module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  "outputDir": "dist/form",
  "publicPath": "/form/",

  pluginOptions: {
    i18n: {
      locale: 'ja',
      fallbackLocale: 'ja',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
