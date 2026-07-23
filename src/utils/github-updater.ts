import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';
import axios from 'axios';

const GITHUB_REPO = 'lumexio/stockmachine-mobile';

export async function checkForUpdates(manualCheck = false) {
  if (Platform.OS !== 'android') {
    if (manualCheck) Alert.alert('Notice', 'In-app updates are only supported on Android.');
    return;
  }

  try {
    const currentVersion = Constants.expoConfig?.version || '1.0.0';
    const response = await axios.get(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
    const release = response.data;
    
    // Naive version compare (assuming tag is like "v1.0.1")
    const latestVersion = release.tag_name.replace('v', '');
    
    if (latestVersion !== currentVersion) {
      Alert.alert(
        'Update Available',
        `A new version (${latestVersion}) is available. Would you like to download and install it?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Download', onPress: () => downloadAndInstallUpdate(release) }
        ]
      );
    } else if (manualCheck) {
      Alert.alert('Up to date', 'You are running the latest version.');
    }
  } catch (error) {
    if (manualCheck) Alert.alert('Error', 'Failed to check for updates.');
  }
}

async function downloadAndInstallUpdate(release: any) {
  try {
    // Find the APK asset
    const apkAsset = release.assets.find((a: any) => a.name.endsWith('.apk'));
    if (!apkAsset) {
      Alert.alert('Error', 'No APK found for this release.');
      return;
    }

    const fileUri = `${FileSystem.documentDirectory}${apkAsset.name}`;
    
    // Download
    const { uri } = await FileSystem.downloadAsync(apkAsset.browser_download_url, fileUri);
    
    // Convert URI to Android Content URI
    const contentUri = await FileSystem.getContentUriAsync(uri);

    // Launch Installer
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: contentUri,
      flags: 1,
      type: 'application/vnd.android.package-archive',
    });
  } catch (error) {
    Alert.alert('Error', 'Failed to download or install the update.');
  }
}
