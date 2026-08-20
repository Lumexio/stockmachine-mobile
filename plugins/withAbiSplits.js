const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAbiSplits(config) {
  return withAppBuildGradle(config, config => {
    const buildGradle = config.modResults.contents;

    // Prevent duplicate injections
    if (buildGradle.includes('splits {')) {
      return config;
    }

    const splitsBlock = `
    splits {
        abi {
            reset()
            enable true
            universalApk false
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
        }
    }
`;
    // Inject the splits block right after the opening "android {" bracket
    config.modResults.contents = buildGradle.replace(
      /android\s*\{/,
      `android {${splitsBlock}`
    );

    return config;
  });
};
