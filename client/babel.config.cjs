// babel.config.cjs
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    ['babel-plugin-transform-import-meta', { replace: 'process.env' }]
  ]
};
