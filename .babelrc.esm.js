module.exports = {
  babelrc: false,
  configFile: false,
  presets: [
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-typescript'
  ],
  ignore: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.ts'],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining',
    ['@babel/transform-runtime', { regenerator: true }],
    '@babel/plugin-transform-nullish-coalescing-operator',
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.es', '.es6', '.mjs']
      }
    ]
  ]
};
