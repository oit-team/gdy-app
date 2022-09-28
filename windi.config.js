const { defineConfig } = require('windicss/helpers')

module.exports = defineConfig({
  preflight: false,
  prefixer: false,
  extract: {
    exclude: ['node_modules', '.git', 'dist'],
  },
  corePlugins: {
    container: false,
  },
  theme: {
    colors: {
      primary: '#ff0000'
    }
  }
})
