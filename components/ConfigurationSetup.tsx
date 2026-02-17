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
import { InputTextHeaderShown } from './FormComponents/InputTextHeaderShown';

const corexlogo = require('../assets/img/corexlogo.png');

export const ConfigurationSetup = () => {
  const [checked, setChecked] = useState(false);
  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  const navigation: any = useNavigation();

  return (
    <Formik
      initialValues={{
        domain: '',
        port: '',
      }}
      validationSchema={Yup.object().shape({
        domain: Yup.string()
          .required('Domain is required')
          .matches(
            /^(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|localhost|(?:\d{1,3}\.){3}\d{1,3})(?::\d{1,5})?$/,
            'Please enter a valid domain or IP address'
          ),
        port: Yup.number()
          .typeError('Port must be a number')
          .integer('Port must be an integer')
          .positive('Port must be a positive number')
          .max(65535, 'Port must be less than or equal to 65535'),
      })}
      onSubmit={async (values) => {
        try {
          Alert.alert(
            'Confirm Configuration',
            `Domain: ${values.domain}\nPort: ${values.port || '80'}\n\nDo you want to save this configuration?`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Save',
                onPress: async () => {
                  const fileUri = `${FileSystem.documentDirectory}configuration.json`;
                  console.log("Dev",__DEV__)
                  const configData = {
                    api_url: `${__DEV__?"http://":"https://"}${values.domain}${values.port ? `:${values.port}` : ''}`,
                    created_at: new Date().toISOString(),
                  };
                  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(configData));
                  navigation.replace('LoginScreen');
                },
              },
            ]
          );
        } catch (error) {
          console.error('Error saving configuration:', error);
          return null;
        }
      }}>
      {({ handleChange, handleSubmit, values, errors, touched, isSubmitting }) => (
        <View className="items-center justify-center flex-1 bg-blue-900">
          <View className="items-center justify-center w-4/5 p-4 bg-white rounded-lg shadow-lg">
            <Image source={corexlogo} style={styles.logo} resizeMode="contain" />
            <Text className="mt-4 text-2xl font-bold text-blue-900">Configuration Setup</Text>
            <Text className="mt-2 text-base text-center text-gray-600">
              Configure which server this application will connect.
            </Text>
            <InputTextHeaderShown
              values={values.domain}
              handleChange={handleChange('domain')}
              errors={errors.domain}
              touched={touched.domain}
              placeholder="IP Address or Domain Name"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              bottomPlaceholder="example.com or 192.168.1.1 "
            />
            <InputTextHeaderShown
              values={values.port}
              handleChange={handleChange('port')}
              errors={errors.port}
              touched={touched.port}
              placeholder="Port"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              bottomPlaceholder="leave blank for default (80)"
            />
            <View className="flex-row items-center w-full mt-4">
              <Checkbox status={checked ? 'checked' : 'unchecked'} onPress={toggleCheckbox} />
              <Text className="inline ml-2 text-gray-600">Save configuration</Text>
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
                  <Text className="text-gray-500"> Saving configuration</Text>
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
