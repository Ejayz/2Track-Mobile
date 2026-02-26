import { FieldArray, Formik, FormikErrors, FormikTouched } from 'formik';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { InputText } from './FormComponents/InputText';
import Feather from '@expo/vector-icons/Feather';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import configRetriver from 'utils/configRetriver';

export const EditMeasurement = ({ route }: any) => {
  const navigation: any = useNavigation();

  const [params, setParams] = useState([
    {
      id: '',
      pallete_number: '',
      length: '',
      inside_diameter: '',
      outside_diameter: '',
      flat_crush: '',
      h20: '',
      remarks: '',
    },
  ]);

  useEffect(() => {
    const forEditData: any = [];

    const parameters = route.params.data;
    const pallete = route.params.pallete;
    parameters.map((data: any, keys: any) => {
      forEditData.push({
        id: data.id,
        pallete_number: `${pallete ?? ''}`,
        length: `${data.length ?? ''}`,
        inside_diameter: `${data.inside_diameter ?? ''}`,
        outside_diameter: `${data.outside_diameter ?? ''}`,
        flat_crush: `${data.flat_crush ?? ''}`,
        h20: `${data.h20 ?? ''}`,
        remarks: data.remarks,
      });
    });

    setParams(forEditData);
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

  const handleFormSubmit = async (values: any, actions: any) => {
    let okStatus = 0;

    try {
      await Promise.all(
        values.items.map(async (item: any) => {
          const configurationData = await configRetriver();
          const bodyContent = JSON.stringify({
            id: item.id,
            length: item.length,
            inside_diameter: item.inside_diameter,
            outside_diameter: item.outside_diameter,
            flat_crush: item.flat_crush,
            h20: item.h20,
            number_control: 0,
            remarks: item.remarks,
            pallete_count: parseInt(item.pallete_number),
          });
          console.log(bodyContent)
          const response = await fetch(
            `${configurationData.api_url}/api/v1/edit_measurement?id=${item.id}`,
            {
              method: 'PUT',
              body: bodyContent,
              headers: {
                Accept: '*/*',
                'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
                'Content-Type': 'application/json',
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            okStatus++;
          } else {
            console.log(data);
          }
        })
      );
    } catch (error: any) {
      console.log(error);
    } finally {
      actions.setSubmitting(false);
    }

    // This now runs AFTER all requests are done
    if (okStatus === values.items.length) {
      actions.resetForm();
      Alert.alert('Success', 'Measurement edited successfully');
      navigation.replace('MeasurementList', {
        order: route.params.order,
      });
    } else {
      Alert.alert(
        'Error',
        `There was an error while updating the measurements. ${okStatus} out of ${values.items.length} measurement(s) were successfully updated.`
      );
    }
  };
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text className="mt-4 text-2xl font-bold text-gray-800">Edit Measurement</Text>
      <ScrollView className="w-full bg-white">
        <Formik
          initialValues={{
            items: params,
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}>
          {({ handleChange, handleSubmit, values, errors, touched, isSubmitting }) => (
            <>
              <FieldArray name="items">
                {() =>
                  values.items.map((item, index) => {
                    const itemError = (errors.items?.[index] as FormikErrors<typeof item>) ?? {};
                    const itemTouched =
                      (touched?.items?.[index] as FormikTouched<typeof item>) ?? {};

                    return (
                      <View key={index} className="w-full p-4">
                        <Text className="text-lg font-bold">Measurement {index + 1}</Text>
                        <InputText
                          values={item.pallete_number}
                          handleChange={handleChange(`items.${index}.pallete_number`)}
                          errors={itemError.pallete_number}
                          touched={itemTouched.pallete_number}
                          placeholder="Pallete Number"
                          keyboardType="numeric"
                        />
                        <InputText
                          values={item.length}
                          handleChange={handleChange(`items.${index}.length`)}
                          errors={itemError.length}
                          touched={itemTouched.length}
                          placeholder="Length"
                          keyboardType="numeric"
                        />
                        <InputText
                          values={item.inside_diameter}
                          handleChange={handleChange(`items.${index}.inside_diameter`)}
                          errors={itemError.inside_diameter}
                          touched={itemTouched.inside_diameter}
                          placeholder="Inside Diameter"
                          keyboardType="numeric"
                        />
                        <InputText
                          values={item.outside_diameter}
                          handleChange={handleChange(`items.${index}.outside_diameter`)}
                          errors={itemError.outside_diameter}
                          touched={itemTouched.outside_diameter}
                          placeholder="Outside Diameter"
                          keyboardType="numeric"
                        />
                        <InputText
                          values={item.flat_crush}
                          handleChange={handleChange(`items.${index}.flat_crush`)}
                          errors={itemError.flat_crush}
                          touched={itemTouched.flat_crush}
                          placeholder="Flat Crush"
                          keyboardType="numeric"
                        />
                        <InputText
                          values={item.h20}
                          handleChange={handleChange(`items.${index}.h20`)}
                          errors={itemError.h20}
                          touched={itemTouched.h20}
                          placeholder="H20"
                          keyboardType="numeric"
                        />
                        <InputText
                          values={item.remarks}
                          handleChange={handleChange(`items.${index}.remarks`)}
                          errors={itemError.remarks}
                          touched={itemTouched.remarks}
                          placeholder="Remarks"
                          keyboardType="default"
                        />
                      </View>
                    );
                  })
                }
              </FieldArray>
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
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};
