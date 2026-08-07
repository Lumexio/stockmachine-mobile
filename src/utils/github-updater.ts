import { Alert, Platform, Linking } from 'react-native';
import packageJson from '../../package.json';

const GITHUB_REPO = 'Lumexio/stockmachine-mobile';

export async function checkForUpdates(manualCheck = false) {
  if (Platform.OS !== 'android') {
    if (manualCheck) Alert.alert('Notice', 'In-app updates are only supported on Android.');
    return;
  }

  try {
    const currentVersion = packageJson.version;
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
    const release = await response.json();
    
    // Naive version compare (assuming tag is like "v1.0.1")
    const latestVersion = release.tag_name?.replace('v', '');
    
    if (latestVersion && latestVersion !== currentVersion && currentVersion !== '0.0.0') {
      const apkAsset = release.assets?.find((a: any) => a.name.endsWith('.apk'));
      if (apkAsset) {
        Alert.alert(
          'Update Available',
          `A new version (${latestVersion}) is available. Would you like to download and install it?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Download', onPress: () => Linking.openURL(apkAsset.browser_download_url) }
          ]
        );
      }
    } else if (manualCheck) {
      Alert.alert('Up to date', 'You are running the latest version.');
    }
  } catch (error) {
    if (manualCheck) Alert.alert('Error', 'Failed to check for updates.');
  }
}
