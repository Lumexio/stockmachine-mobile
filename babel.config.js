module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
            '@api': './src/api',
            '@constants': './src/constants',
            '@i18n': './src/i18n',
            '@navigation': './src/navigation',
            '@store': './src/store',
            '@theme': './src/theme',
            '@features': './src/features',
          },
        },
      ],
    ],
  };
};
