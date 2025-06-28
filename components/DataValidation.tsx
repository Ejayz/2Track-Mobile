import { View, Text, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

export const DataValidation = () => {
  const [message, setMessage] = useState<string>('Data validation in progress...');
  const navigation: any = useNavigation();
  const retrieveCorexData = async () => {
    let headersList = {
      Accept: '*/*',
      'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
    };

    let response = await fetch('https://www.sledgehammerdevelopmentteam.uk/api/mobile/copy_data', {
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
      await FileSystem.deleteAsync(`${FileSystem.documentDirectory}authentication.json`)
      navigation.navigate("LoginScreen")
      return;
    }

    let data = await response.json();
    setMessage(` Corex data retrieved successfully! Saving data locally...`);

    try {
      setMessage(' Saving article data...');
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_article.json`,
        JSON.stringify(data.article)
      );
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_article_max`,
        JSON.stringify(data.articleMax)
      );
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_article_min`,
        JSON.stringify(data.articleMin)
      );
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_article_nominal`,
        JSON.stringify(data.articleNominal)
      );
      setMessage(' Article data saved successfully!');
      setMessage(` Saving customer data...`);
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_customer.json`,
        JSON.stringify(data.customer)
      );
      setMessage(' Customer data saved successfully!');
      setMessage(` Saving assignee history data...`);
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_assignee_history.json`,
        JSON.stringify(data.assigneeHistory)
      );
      setMessage(' Assignee history data saved successfully!');
      setMessage(` Saving laboratory data...`);
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_laboratory.json`,
        JSON.stringify(data.laboratory)
      );
      setMessage(' Laboratory data saved successfully!');
      setMessage(` Saving measurement data...`);
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_measurement.json`,
        JSON.stringify(data.measurement)
      );
      setMessage(' Measurement data saved successfully!');
      setMessage(` Saving measurement history data...`);
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_measurement_history.json`,
        JSON.stringify(data.measurementHistory)
      );
      setMessage(' Measurement history data saved successfully!');
      setMessage(` Saving orders form data...`);
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_orders_form.json`,
        JSON.stringify(data.ordersForm)
      );
      setMessage(' Orders form data saved successfully!');
      setMessage(` Saving production data...`);
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_production.json`,
        JSON.stringify(data.production)
      );
      setMessage(' Production data saved successfully!');
      setMessage(` Saving proofing data...`);
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_proofing.json`,
        JSON.stringify(data.proofing)
      );
      setMessage(' Proofing data saved successfully!');
      setMessage(` Saving users data...`);
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}tbl_users.json`,
        JSON.stringify(data.users)
      );
      setMessage(' Users data saved successfully!');
      setMessage(` Saving corex validation data...`);

      const authentication = JSON.parse(
        await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}authentication.json`)
      );

      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}corex-validation.json`,
        JSON.stringify({
          validation_date: new Date().toISOString(),
          latest_update: new Date().toISOString(),
          latest_user: authentication.user.id,
        })
      );
      setMessage(' Corex validation data saved successfully!');
      Alert.alert('Data Validation', 'Corex data has been successfully validated and saved.', [
        {
          text: 'OK',
          style: 'default',
          isPreferred: true,
          onPress: () => {
            navigation.navigate('Dashboard', {
              sessionData: authentication,
            });
          },
        },
      ]);
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
        retrieveCorexData();
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
