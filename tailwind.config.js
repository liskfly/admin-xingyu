module.exports = {
  purge: [ './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        cyan: '#004ea1',
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
