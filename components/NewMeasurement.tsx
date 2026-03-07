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
import { fetchWithRetry } from 'utils/fetchRetry';
export const NewMeasurement = ({ route }: any) => {
  const navigation: any = useNavigation();

  const nofValidationSchema = Yup.object().shape({
    pallete_number: Yup.number()
      .typeError('Pallete number must be a valid number')
      .required('Pallete number is required'),
    length: Yup.number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .typeError('Length must be a valid number'),
    inside_diameter: Yup.number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .typeError('Inside diameter must be a valid number'),
    outside_diameter: Yup.number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .typeError('Outside diameter must be a valid number'),
    flat_crush: Yup.number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .typeError('Flat crush must be a valid number'),
    h20: Yup.number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .typeError('H20 must be a valid number'),
    remarks: Yup.string().nullable().max(255, 'Remarks must not exceed 255 characters'),
  });

  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text className="mt-4 text-2xl font-bold text-gray-800">OF ID:{route.params.order}</Text>
      <ScrollView className="w-full bg-white">
        <Formik
          validationSchema={nofValidationSchema}
          initialValues={{
            pallete_number: '',
            length1: '',
            length2: '',
            length3: '',
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

            const lengths = [values.length1, values.length2, values.length3];

            const ok = await Promise.all(
              lengths.map((length, index) => {
                const data = JSON.stringify({
                  order_id: parseInt(route.params.ofid),
                  ofid: `${route.params.order}`,
                  length: `${length}`,
                  inside_diameter: index === 0 ? `${values.inside_diameter}` : ``,
                  outside_diameter: index === 0 ? `${values.outside_diameter}` : ``,
                  flat_crush: index === 0 ? `${values.flat_crush}` : ``,
                  h20: index === 0 ? `${values.h20}` : ``,
                  number_control: 0,
                  remarks: index === 0 ? `${values.remarks}` : ``,
                  pallete_count: parseInt(values.pallete_number),
                  user_id: null,
                });

                return fetchWithRetry(
                  `${configurationData.api_url}/api/v1/create_measurement`,
                  {
                    method: 'POST',
                    body: data,
                    headers: headersList,
                  },
                  3
                );
              })
            );

            if (ok) {
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
                values={values.length1}
                handleChange={handleChange('length1')}
                errors={errors.length1}
                touched={touched.length1}
                placeholder="Length 1"
                textContentType="numeric"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                keyboardType="numeric"
              />
              <InputText
                values={values.length2}
                handleChange={handleChange('length2')}
                errors={errors.length2}
                touched={touched.length2}
                placeholder="Length 2"
                textContentType="numeric"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                keyboardType="numeric"
              />
              <InputText
                values={values.length3}
                handleChange={handleChange('length3')}
                errors={errors.length3}
                touched={touched.length3}
                placeholder="Length 3"
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
                      page: route.params.page,
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
