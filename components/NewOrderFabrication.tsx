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
} from 'react-native';
import { InputSearch } from './FormComponents/InputSearch';
import { InputText } from './FormComponents/InputText';
import Feather from '@expo/vector-icons/Feather';
import configRetriver from 'utils/configRetriver';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
export const NewOrderFabrication = () => {
  const [customerName, setCustomerName] = useState<string>('');
  const [articleId, setArticleId] = useState<string>('');
  const [isCustomerNameSameAsSearch, setIsCustomerNameSameAsSearch] = useState<boolean>(false);
  const [isarticleIdSameAsSearch, setIsArticleIdSameAsSearch] = useState<boolean>(false);
  const navigation: any = useNavigation();
  const {
    data: customerData,
    error: customerDataError,
    isFetching: customerDataIsFetching,
  } = useQuery({
    queryKey: ['customer-name-search', customerName],
    queryFn: async () => {
      if (customerName == '') {
        return { data: [] };
      } else {
        const configurationData = await configRetriver();
        let headersList = {
          Accept: '*/*',
          'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        };

        let response = await fetch(
          `${configurationData.api_url}/api/v1/get_customers?page=1&search=${customerName}&limit=10`,
          {
            method: 'GET',
            headers: headersList,
          }
        );
        console.log(response);
        let data = await response.json();
        return data;
      }
    },
  });

  const {
    data: articleIdData,
    error: articleIdDataError,
    isFetching: articleIdDataIsFetching,
  } = useQuery({
    queryKey: ['product-name-search', articleId],
    queryFn: async () => {
      if (articleId == '') {
        return { data: [] };
      } else {
        const configurationData = await configRetriver();
        let headersList = {
          Accept: '*/*',
          'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        };

        let response = await fetch(
          `${configurationData.api_url}/api/v1/get_article_prod_options?search=${articleId}&limit=50`,
          {
            method: 'GET',
            headers: headersList,
          }
        );

        let data = await response.json();

        console.log(data.data[0]);
        return data;
      }
    },
  });

  const nofValidationSchema = Yup.object().shape({
    order_id: Yup.number().required('Order ID is required'),
    customer_name: Yup.string().required('Customer Name is required'),
    article_id: Yup.string().required('Article ID is required'),
    pallet_count: Yup.number()
      .typeError('Pallet Count must be a number')
      .required('Pallet Count is required'),
  });

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-800">New Order Fabrication</Text>
      <Formik
        validationSchema={nofValidationSchema}
        initialValues={{ order_id: '', pallet_count: '', customer_name: '', article_id: '' }}
        onSubmit={async (values, action) => {
          const configurationData = await configRetriver();
          console.log(values);
          let headersList = {
            Accept: '*/*',
            'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
            'Content-Type': 'application/json',
          };

          let bodyContent = JSON.stringify({
            order_fabrication_control: values.order_id,
            customer_id: values.customer_name,
            article_id: values.article_id,
            pallete_count: values.pallet_count,
          });
          console.log({
            order_fabrication_control: values,
            customer_id: values.customer_name,
            article_id: values.article_id,
            pallete_count: values.pallet_count,
          });
          let response = await fetch('https://2track-qcms.vercel.app/api/v1/create_order', {
            method: 'POST',
            body: bodyContent,
            headers: headersList,
          });

          let data = await response.json();
          console.log(data);
          if (data.code == 200) {
            action.resetForm();
            alert('Order fabrication created successfully');
            navigation.replace('OrderFabricationList');
          } else {
            alert('Error creating order fabrication');
          }
        }}>
        {({ handleChange, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
          <View className="w-full p-4">
            <InputText
              values={values.order_id}
              handleChange={handleChange('order_id')}
              errors={errors.order_id}
              touched={touched.order_id}
              placeholder="Order ID"
              textContentType="none"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              keyboardType="numeric"
            />

            <InputSearch
              setFieldValue={setFieldValue}
              field="customer_name"
              values={customerName}
              errors={errors.customer_name}
              touched={touched.customer_name}
              onChangeText={setCustomerName}
              placeholder="Customer Name"
              textContentType="name"
              keyboardType="default"
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name">
              {customerName == '' ? (
                <></>
              ) : isarticleIdSameAsSearch && customerName !== '' ? (
                <></>
              ) : values.customer_name !== '' && customerName !== '' ? (
                <></>
              ) : customerDataError && customerName !== '' ? (
                <View className="mt-2 flex-row items-center justify-center">
                  <Feather name="x" size={20} color="red" />
                  <Text className="ml-2 text-red-500">Error fetching customer data</Text>
                </View>
              ) : customerDataIsFetching && customerName !== '' ? (
                <View className="mt-2 flex-row items-center justify-center">
                  <Feather name="loader" size={20} color="gray" className="animate-spin" />
                  <Text className="ml-2 text-gray-600">Searching...</Text>
                </View>
              ) : customerData.data.length == 0 && customerName !== '' ? (
                <View className="mt-2 flex-row items-center justify-center">
                  <Feather name="x" size={20} color="red" />
                  <Text className="ml-2 text-red-500">No customers found</Text>
                </View>
              ) : (
                customerData.data.map((customer: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    className="flex-row items-center border-b border-gray-200 p-2"
                    onPress={() => {
                      if (customerName !== customer.company_name) {
                        setFieldValue('customer_name', customer.id);
                        setCustomerName(customer.company_name);
                      } else {
                        setFieldValue('customer_name', customer.id);
                        setCustomerName(customer.company_name);
                      }
                    }}>
                    <Feather name="search" size={20} color="gray" />
                    <View className="ml-2">
                      <Text className="font-semibold text-gray-700">{customer.company_name}</Text>
                      <Text className="text-xs text-gray-500">Code: {customer.id}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </InputSearch>
            <InputSearch
              setFieldValue={setFieldValue}
              field="article_id"
              values={articleId}
              errors={errors.article_id}
              touched={touched.article_id}
              onChangeText={setArticleId}
              placeholder="Article ID"
              textContentType="number"
              keyboardType="numeric"
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name">
              {articleId == '' ? (
                <></>
              ) : values.article_id !== '' && articleId !== '' ? (
                <></>
              ) : articleIdDataError && articleId !== '' ? (
                <View className="mt-2 flex-row items-center justify-center">
                  <Feather name="x" size={20} color="red" />
                  <Text className="ml-2 text-red-500">Error fetching customer data</Text>
                </View>
              ) : articleIdDataIsFetching && articleId !== '' ? (
                <View className="mt-2 flex-row items-center justify-center">
                  <Feather name="loader" size={20} color="gray" className="animate-spin" />
                  <Text className="ml-2 text-gray-600">Searching...</Text>
                </View>
              ) : articleIdData.data.length == 0 && articleId !== '' ? (
                <View className="mt-2 flex-row items-center justify-center">
                  <Feather name="x" size={20} color="red" />
                  <Text className="ml-2 text-red-500">No articles found</Text>
                </View>
              ) : (
                articleIdData.data.map((article: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    className="flex-row items-center border-b border-gray-200 p-2"
                    onPress={() => {
                      if (article.article.toString() !== articleId) {
                        setFieldValue('article_id', article.id);
                        setArticleId(article.article.toString());
                      } else {
                        setFieldValue('article_id', article.id);
                        setArticleId(article.article.toString());
                      }
                    }}>
                    <Feather name="search" size={20} color="gray" />
                    <View className="ml-2">
                      <Text className="font-semibold text-gray-700">{article.article}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </InputSearch>
            <InputText
              values={values.pallet_count}
              handleChange={handleChange('pallet_count')}
              errors={errors.pallet_count}
              touched={touched.pallet_count}
              placeholder="Pallet Count"
              textContentType="none"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              keyboardType="numeric"
            />
            <View className="mt-4">
              <Pressable
                onPress={() => handleSubmit()}
                className="w-full rounded-lg bg-blue-custom-1 p-3 text-white">
                {isSubmitting ? (
                  <View className="flex-row items-center justify-center">
                    <Feather name="loader" size={20} color="white" className="animate-spin" />
                    <Text className="ml-2 text-white">Creating...</Text>
                  </View>
                ) : (
                  <Text className="text-center text-lg font-medium text-white">Create</Text>
                )}
              </Pressable>
              <Pressable
                onPress={() => navigation.replace('Dashboard')}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-gray-700">
                <Text className="text-center text-lg font-medium text-gray-700">Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};
