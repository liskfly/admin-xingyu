module.exports = {
  purge: [ './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        cyan: '#004ea1',
        cyan1:'#004493'
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
