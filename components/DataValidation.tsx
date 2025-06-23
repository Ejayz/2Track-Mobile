import { View, Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';

export const DataValidation = () => {
  const [message, setMessage] = useState<string>('Data validation in progress...');

  const retrieveCorexData = async () => {
    let headersList = {
      Accept: '*/*',
      'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
    };

    let response = await fetch('http://localhost:3000/api/mobile/copy_data', {
      method: 'POST',
      headers: headersList,
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert('Unauthorized: Please check your email and password');
        return;
      } else if (response.status === 500) {
        alert('Internal Server Error: Please try again later');
        return;
      } else if (response.status === 404) {
        alert('Not Found: The requested resource could not be found');
        return;
      } else if (response.status === 400) {
        alert('Bad Request: Please check your input and try again');
        return;
      } else if (response.status === 403) {
        alert('Forbidden: You do not have permission to access this resource');
        return;
      }
      alert(`Error: Something went wrong. Status code: ${response.status}`);
      return;
    }

    let data = await response.json();
    console.log('Corex data retrieved:', data);
    setMessage(` Corex data retrieved successfully! Saving data locally...`);

    try {
      setMessage(' Saving article data...');
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_article.json`,
        JSON.stringify(data.articles)
      );
    } catch (error) {
      console.log('Error saving corex-validation.json:', error);
      setMessage(' Error saving data. Please try again later.');
    }
  };

  useEffect(() => {
    const validateData = async () => {
      try {
        const readCorexValidation = await FileSystem.readDirectoryAsync(
          `${FileSystem.documentDirectory}corex-validation.json`
        );
      } catch (error) {
        console.log('Error reading corex-validation.json:', error);
        setMessage(' No data found . Retreiving data...');
        // retrieveCorexData();
      }
    };

    validateData();
  }, []);

  return (
    <>
      <View className="items-center justify-center flex-1 bg-blue-900">
        <View className="w-3/4 p-4 bg-white rounded-lg shadow-md">
          <View className="flex flex-row items-center mb-4">
            <Feather name="alert-triangle" size={24} color={'orange'} className="text-center" />
            <Text className="text-lg font-bold text-gray-800"> Checking data</Text>
          </View>
          <View className="flex flex-row items-center justify-center">
            <Text className="text-gray-600">
              Please wait while we Corex data stored on your device. This may take a few moments
              depending on the amount of data. Please do not close the app during this process.
            </Text>
          </View>
          <View className="mt-4">
            <View className="flex flex-row items-center justify-center">
              <Feather name="loader" size={24} color={'#1e3a8a'} className="ml-2 animate-spin" />
              <Text className="text-gray-500"> {message}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
