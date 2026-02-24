import { Formik, useFormikContext } from 'formik';
import { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  GestureResponderEvent,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { InputSearch } from './FormComponents/InputSearch';
import { InputText } from './FormComponents/InputText';
import Feather from '@expo/vector-icons/Feather';
import configRetriver from 'utils/configRetriver';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
export const NewMeasurement = ({ route }: any) => {
  const navigation: any = useNavigation();

  const nofValidationSchema = Yup.object().shape({
    pallete_number: Yup.number()
      .typeError('Pallete number must be a valid number')
      .required('Pallete number is required'),
    length: Yup.number().typeError('Length must be a valid number'),
    inside_diameter: Yup.number().typeError('Inside diameter must be a valid number'),
    outside_diameter: Yup.number().typeError('Outside diameter must be a valid number'),
    flat_crush: Yup.number().typeError('Flat crush must be a valid number'),
    h20: Yup.number().typeError('H20 must be a valid number'),
    remarks: Yup.string().nullable().max(255, 'Remarks must not exceed 255 characters'),
  });

  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text className="text-2xl font-bold text-gray-800">New Measurement</Text>
      <ScrollView className="w-full bg-white">
        <Formik
          validationSchema={nofValidationSchema}
          initialValues={{
            pallete_number: '',
            length: '',
            inside_diameter: '',
            outside_diameter: '',
            flat_crush: '',
            h20: '',
            remarks: '',
          }}
          onSubmit={async (values, action) => {
            const configurationData = await configRetriver();
            console.log(values);
            let headersList = {
              Accept: '*/*',
              'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
              'Content-Type': 'application/json',
            };
            console.log(route.params);
            let bodyContent = JSON.stringify({
              order_id: parseInt(route.params.ofid),
              ofid: `${route.params.order}`,
              length: `${values.length}`,
              inside_diameter: `${values.inside_diameter}`,
              outside_diameter: `${values.outside_diameter}`,
              flat_crush: `${values.flat_crush}`,
              h20: `${values.h20}`,
              number_control: 0,
              remarks: `${values.remarks}`,
              pallete_count: parseInt(values.pallete_number),
              user_id: null,
            });
            console.log(bodyContent);
            let response = await fetch(`${configurationData.api_url}/api/v1/create_measurement`, {
              method: 'POST',
              body: bodyContent,
              headers: headersList,
            });
            console.log(response);
            let data = await response.json();

            if (response.ok) {
              action.resetForm();
              alert('Order fabrication created successfully');
              navigation.replace('MeasurementList', {
                order: route.params.order,
              });
            } else {
              alert('Error creating order fabrication');
            }
          }}>
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
          }) => (
            <View className="w-full p-4">
              <InputText
                values={values.pallete_number}
                handleChange={handleChange('pallete_number')}
                errors={errors.pallete_number}
                touched={touched.pallete_number}
                placeholder="Pallete Number"
                textContentType="numeric"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                keyboardType="numeric"
              />
              <InputText
                values={values.length}
                handleChange={handleChange('length')}
                errors={errors.length}
                touched={touched.length}
                placeholder="Length"
                textContentType="numeric"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                keyboardType="numeric"
              />
              <InputText
                values={values.inside_diameter}
                handleChange={handleChange('inside_diameter')}
                errors={errors.inside_diameter}
                touched={touched.inside_diameter}
                placeholder="Inside Diameter"
                textContentType="numeric"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                keyboardType="numeric"
              />
              <InputText
                values={values.outside_diameter}
                handleChange={handleChange('outside_diameter')}
                errors={errors.outside_diameter}
                touched={touched.outside_diameter}
                placeholder="Outside Diameter"
                textContentType="numeric"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                keyboardType="numeric"
              />

              <InputText
                values={values.flat_crush}
                handleChange={handleChange('flat_crush')}
                errors={errors.flat_crush}
                touched={touched.flat_crush}
                placeholder="Flat Crush"
                textContentType="numeric"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                keyboardType="numeric"
              />
              <InputText
                values={values.h20}
                handleChange={handleChange('h20')}
                errors={errors.h20}
                touched={touched.h20}
                placeholder="H20"
                textContentType="numeric"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                keyboardType="numeric"
              />
              <InputText
                values={values.remarks}
                handleChange={handleChange('remarks')}
                errors={errors.remarks}
                touched={touched.remarks}
                placeholder="Remarks"
                textContentType="default"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                keyboardType="default"
              />
              <View className="mt-4">
                <Pressable
                  onPress={() => handleSubmit()}
                  className="w-full p-3 text-white rounded-lg bg-blue-custom-1">
                  {isSubmitting ? (
                    <View className="flex-row items-center justify-center">
                      <Feather name="loader" size={20} color="white" className="animate-spin" />
                      <Text className="ml-2 text-white">Creating...</Text>
                    </View>
                  ) : (
                    <Text className="text-lg font-medium text-center text-white">Create</Text>
                  )}
                </Pressable>
                <Pressable
                  onPress={() =>
                    navigation.replace('MeasurementList', {
                      order: route.params.order,
                    })
                  }
                  className="w-full p-3 mt-2 text-gray-700 border border-gray-300 rounded-lg">
                  <Text className="text-lg font-medium text-center text-gray-700">Cancel</Text>
                </Pressable>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};
