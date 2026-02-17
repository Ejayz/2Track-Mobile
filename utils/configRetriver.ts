import * as FileSystem from 'expo-file-system';

export default async function configRetriver() {
    const fileUri = `${FileSystem.documentDirectory}configuration.json`;
    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const authenticationData = JSON.parse(fileContent);
      return authenticationData;
    } catch (error) {
        console.error('Error retrieving authentication data:', error);
        return null;
    }
  }
