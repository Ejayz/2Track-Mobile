import { FieldArray, Formik, FormikErrors, FormikTouched } from 'formik';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { InputText } from './FormComponents/InputText';
import Feather from '@expo/vector-icons/Feather';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import configRetriver from 'utils/configRetriver';
import { fetchWithRetry } from 'utils/fetchRetry';

export const EditMeasurement = ({ route }: any) => {
  const navigation: any = useNavigation();

  useEffect(() => {
    console.log('Test Data ', route.params.data);
  }, [route]);

  // Validation schema for array items
  const validationSchema = Yup.object().shape({
    items: Yup.array(
      Yup.object().shape({
        pallete_number: Yup.number()
          .typeError('Pallete number must be a valid number')
          .required('Pallete number is required'),
        length: Yup.number().typeError('Length must be a valid number').nullable(),
        inside_diameter: Yup.number()
          .typeError('Inside diameter must be a valid number')
          .nullable(),
        outside_diameter: Yup.number()
          .typeError('Outside diameter must be a valid number')
          .nullable(),
        flat_crush: Yup.number().typeError('Flat crush must be a valid number').nullable(),
        h20: Yup.number().typeError('H20 must be a valid number').nullable(),
        remarks: Yup.string().nullable().max(255, 'Remarks must not exceed 255 characters'),
      })
    ),
  });

  const handleFormSubmit = async (values: any, action: any) => {
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
          length: length.data,
          inside_diameter: index === 0 ? values.inside_diameter : null,
          outside_diameter: index === 0 ? values.outside_diameter : null,
          flat_crush: index === 0 ? values.flat_crush : null,
          h20: index === 0 ? values.h20 : null,
          number_control: 0,
          remarks: `${values.remarks}`,
          pallete_count: parseInt(values.pallete_number),
          ok: null,
        });
        console.log(data);
        return fetchWithRetry(
          `${configurationData.api_url}/api/v1/edit_measurement?id=${length.id}`,
          {
            method: 'PUT',
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
  };
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text className="mt-4 text-2xl font-bold text-gray-800">Edit Measurement</Text>
      <ScrollView className="w-full bg-white">
        <Formik
          initialValues={{
            id: route.params.id,
            pallete_number: `${route.params.pallete ?? ''}`,
            length1: {
              data: `${route.params.data[0].length == undefined || route.params.data[0].length == null || route.params.data[0].length == '' ? '' : route.params.data[0].length}`,
              id: route.params.data[0].id,
            },
            length2: { data: `${route.params.data[1].length == undefined || route.params.data[1].length == null || route.params.data[1].length == '' ? '' : route.params.data[1].length}`, id: route.params.data[1].id },
            length3: { data: `${route.params.data[2].length == undefined || route.params.data[2].length == null || route.params.data[2].length == '' ? '' : route.params.data[2].length}`, id: route.params.data[2].id },
            inside_diameter: `${
              route.params.data
                .filter(
                  (item: any) =>
                    item.length !== null &&
                    item.inside_diameter !== undefined &&
                    item.inside_diameter !== '' &&
                    item.inside_diameter !== null &&
                    item.remarks !== 'undefined'
                )
                .map((item: any) => item.outside_diameter) ?? ''
            }`,
            outside_diameter: `${
              route.params.data
                .filter(
                  (item: any) =>
                    item.length !== null &&
                    item.outside_diameter !== undefined &&
                    item.outside_diameter !== '' &&
                    item.outside_diameter !== null &&
                    item.remarks !== 'undefined'
                )
                .map((item: any) => item.outside_diameter) ?? ''
            }`,
            flat_crush: `${
              route.params.data
                .filter(
                  (item: any) =>
                    item.length !== null &&
                    item.flat_crush !== undefined &&
                    item.flat_crush !== '' &&
                    item.flat_crush !== null &&
                    item.remarks !== 'undefined'
                )
                .map((item: any) => item.flat_crush) ?? ''
            }`,
            h20: `${
              route.params.data
                .filter(
                  (item: any) =>
                    item.length !== null &&
                    item.h2o !== undefined &&
                    item.h2o !== '' &&
                    item.h2o !== null &&
                    item.remarks !== 'undefined'
                )
                .map((item: any) => item.h2o) ?? ''
            }`,
            remarks: `${
              route.params.data
                .filter(
                  (item: any) =>
                    item.length !== null &&
                    item.remarks !== undefined &&
                    item.remarks !== '' &&
                    item.remarks !== null &&
                    item.remarks !== 'undefined'
                )
                .map((item: any) => item.remarks) ?? ''
            }`,
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}>
          {({ handleChange, handleSubmit, values, errors, touched, isSubmitting }) => {
            console.log(values);

            return (
              <>
                <View className="w-full p-4">
                  <Text className="text-lg font-bold">
                    Measurement for Pallete {route.params.pallette}
                  </Text>
                  <InputText
                    values={values.pallete_number}
                    handleChange={handleChange(`pallete_number`)}
                    errors={errors.pallete_number}
                    touched={touched.pallete_number}
                    placeholder="Pallete Number"
                    keyboardType="numeric"
                  />

                  <InputText
                    values={values.length1.data}
                    handleChange={handleChange(`length1.data`)}
                    errors={errors.length1?.data}
                    touched={touched.length1?.data}
                    placeholder="Length 1"
                    keyboardType="numeric"
                  />
                  <InputText
                    values={values.length2.data}
                    handleChange={handleChange(`length2.data`)}
                    errors={errors.length2?.data}
                    touched={touched.length2?.data}
                    placeholder="Length 2"
                    keyboardType="numeric"
                  />
                  <InputText
                    values={values.length3.data}
                    handleChange={handleChange(`length3.data`)}
                    errors={errors.length3?.data}
                    touched={touched.length3?.data}
                    placeholder="Length 3"
                    keyboardType="numeric"
                  />
                  <InputText
                    values={values.inside_diameter}
                    handleChange={handleChange(`inside_diameter`)}
                    errors={errors.inside_diameter}
                    touched={touched.inside_diameter}
                    placeholder="Inside Diameter"
                    keyboardType="numeric"
                  />
                  <InputText
                    values={values.outside_diameter}
                    handleChange={handleChange(`outside_diameter`)}
                    errors={errors.outside_diameter}
                    touched={touched.outside_diameter}
                    placeholder="Outside Diameter"
                    keyboardType="numeric"
                  />
                  <InputText
                    values={values.flat_crush}
                    handleChange={handleChange(`flat_crush`)}
                    errors={errors.flat_crush}
                    touched={touched.flat_crush}
                    placeholder="Flat Crush"
                    keyboardType="numeric"
                  />
                  <InputText
                    values={values.h20}
                    handleChange={handleChange(`h20`)}
                    errors={errors.h20}
                    touched={touched.h20}
                    placeholder="H20"
                    keyboardType="numeric"
                  />
                  <InputText
                    values={values.remarks}
                    handleChange={handleChange(`remarks`)}
                    errors={errors.remarks}
                    touched={touched.remarks}
                    placeholder="Remarks"
                    keyboardType="default"
                  />
                </View>
                <View className="w-3/4 mx-auto mt-4 mb-2">
                  <Pressable
                    onPress={() => handleSubmit()}
                    className="flex-row items-center justify-center w-full p-3 rounded-lg bg-blue-custom-1">
                    {isSubmitting ? (
                      <>
                        <Feather name="loader" size={20} color="white" className="animate-spin" />
                        <Text className="ml-2 text-white">Editing...</Text>
                      </>
                    ) : (
                      <Text className="text-lg font-medium text-center text-white">Edit</Text>
                    )}
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      navigation.replace('MeasurementList', { order: route.params.order })
                    }
                    className="w-full p-3 mt-2 text-gray-700 border border-gray-300 rounded-lg">
                    <Text className="text-lg font-medium text-center text-gray-700">Cancel</Text>
                  </Pressable>
                </View>
              </>
            );
          }}
        </Formik>
      </ScrollView>
    </View>
  );
};
