import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Button,
  GestureResponderEvent,
  Alert,
} from 'react-native';
import { Checkbox } from '@futurejj/react-native-checkbox';
import { useEffect, useState } from 'react';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import * as Yup from 'yup';
import { InputText } from './FormComponents/InputText';
import { InputPassword } from './FormComponents/InputPassword';
import Feather from '@expo/vector-icons/Feather';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const corexlogo = require('../assets/img/corexlogo.png');

export const LoginScreen = () => {
  const [checked, setChecked] = useState(false);
  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  const navigation: any = useNavigation();
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const fileUri = `${FileSystem.documentDirectory}authentication.json`;
        const fileExists = await FileSystem.getInfoAsync(fileUri);
        if (fileExists.exists) {
          const sessionData = await FileSystem.readAsStringAsync(fileUri);
          console.log('Session Data:', sessionData);
          Alert.alert('Welcome Back', 'You are already logged in.', [
            {
              text: 'OK',
              style: 'default',
              isPreferred: true,
              onPress: () => {
                navigation.navigate('DataValidation');
              },
            },
          ]);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuthentication();
  }, []);

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
      })}
      onSubmit={async (values) => {
        console.log('Form values:', values);
        const result = await authenticate(values.email, values.password);
        if (result) {
          if (!result) {
          } else {
            FileSystem.writeAsStringAsync(
              `${FileSystem.documentDirectory}authentication.json`,
              result
            )
              .then(() => {
                Alert.alert(
                  'Authentication',
                  'Welcome to CoreX, you have successfully logged in!',
                  [
                    {
                      text: 'OK',
                      style: 'default',
                      isPreferred: true,
                      onPress: () => {
                        navigation.navigate('DataValidation', {
                          sessionData: result,
                        });
                      },
                    },
                  ]
                );
              })
              .catch((error) => {
                alert('Error saving session data:' + error.message);
              });
          }
        }
      }}>
      {({ handleChange, handleSubmit, values, errors, touched, isSubmitting }) => (
        <View className="items-center justify-center flex-1 bg-blue-900">
          <View className="items-center justify-center w-4/5 p-4 bg-white rounded-lg shadow-lg">
            <Image source={corexlogo} style={styles.logo} resizeMode="contain" />
            <Text className="mt-4 text-2xl font-bold text-blue-900">Welcome to CoreX</Text>
            <Text className="mt-2 text-lg text-gray-600">Please log in to continue</Text>
            <InputText
              values={values.email}
              handleChange={handleChange('email')}
              errors={errors.email}
              touched={touched.email}
              placeholder="Email"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
            />
            <InputPassword
              values={values.password}
              handleChange={handleChange('password')}
              errors={errors.password}
              touched={touched.password}
              checked={checked}
              placeholder="Password"
              textContentType="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
            />
            <View className="flex-row items-center w-full mt-4">
              <Checkbox status={checked ? 'checked' : 'unchecked'} onPress={toggleCheckbox} />
              <Text className="inline ml-2 text-gray-600">Show Password</Text>
            </View>
            <View className="w-full mt-4">
              {isSubmitting ? (
                <View className="flex flex-row items-center justify-center">
                  <Feather
                    name="loader"
                    size={24}
                    color={'#1e3a8a'}
                    className="ml-2 animate-spin"
                  />
                  <Text className="text-gray-500"> Authenticating...</Text>
                </View>
              ) : (
                <Button
                  onPress={handleSubmit as unknown as (e: GestureResponderEvent) => void}
                  title="Submit"
                />
              )}
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 200, // or '100%' to fit container width
    height: 100, // adjust based on your image aspect ratio
  },
});

const authenticate = async (email: string, password: string) => {
  try {
    let headersList = {
      Accept: '*/*',
      'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      'Content-Type': 'application/json',
    };

    let bodyContent = JSON.stringify({
      email: email,
      password: password,
    });

    let response = await fetch('https://sledgehammerdevelopmentteam.uk/api/authentication', {
      method: 'POST',
      body: bodyContent,
      headers: headersList,
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert('Unauthorized: Please check your email and password');
        return false;
      } else if (response.status === 500) {
        alert('Internal Server Error: Please try again later');
        return false;
      } else if (response.status === 404) {
        alert('Not Found: The requested resource could not be found');
        return false;
      } else if (response.status === 400) {
        alert('Bad Request: Please check your input and try again');
        return false;
      } else if (response.status === 403) {
        alert('Forbidden: You do not have permission to access this resource');
        return false;
      }
      alert(`Error: Something went wrong. Status code: ${response.status}`);
      return false;
    }
    let data = await response.text();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error during authentication:', error);
    return 'An error occurred while trying to authenticate. Please try again later.';
  }
};
