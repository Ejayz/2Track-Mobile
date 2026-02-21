import { Formik, FormikProvider, useFormik, useFormikContext } from 'formik';
import { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  GestureResponderEvent,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { InputSearch } from './FormComponents/InputSearch';
import { InputText } from './FormComponents/InputText';
import Feather from '@expo/vector-icons/Feather';
import configRetriver from 'utils/configRetriver';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

export const EditOrderFabrication = ({ route }: any) => {
  const { order } = route.params;
  const [customerName, setCustomerName] = useState<string>('');
  const [articleId, setArticleId] = useState<string>('');
  const [isarticleIdSameAsSearch, setIsArticleIdSameAsSearch] = useState<boolean>(false);
  const navigation: any = useNavigation();
  const [orderArticleId, setOrderArticleId] = useState();

  const nofValidationSchema = Yup.object().shape({
    order_id: Yup.string().required('Order ID is required'),
    customer_name: Yup.string().required('Customer Name is required'),
    article_id: Yup.string().required('Article ID is required'),
    pallet_count: Yup.number()
      .typeError('Pallet Count must be a number')
      .required('Pallet Count is required'),
  });

  const formik = useFormik({
    validationSchema: nofValidationSchema,
    enableReinitialize: true,
    initialValues: {
      order_id: '',
      pallet_count: '',
      customer_name: '',
      article_id: '',
    },
    onSubmit: async (values) => {
      const configData = await configRetriver();
      const response = await fetch(`${configData.api_url}/api/v1/edit_order?id=${order}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: `${values.article_id}`,
          customer_id: parseInt(values.customer_name),
          order_fabrication_control: `${values.order_id}`,
          pallete_count: parseInt(values.pallet_count),
        }),
      });
      console.log(response);
      if (response.ok) {
        Alert.alert('Success', 'Order updated successfully', [
          {
            text: 'OK',
            onPress: () => navigation.replace('OrderFabricationList'),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to update order');
      }
    },
  });

  const {
    data: OrderFabricationData,
    error: OrderFabricationDataError,
    isFetching: OrderFabricationIsFetching,
  } = useQuery({
    queryKey: ['order-fabrication-data', order],
    queryFn: async () => {
      const configData = await configRetriver();

      let headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      };

      let response = await fetch(`${configData.api_url}/api/v1/get_order_by_id?id=${order}`, {
        method: 'GET',
        headers: headersList,
      });

      let data = await response.json();

      return data;
    },
  });
   
useEffect(() => {
    if (OrderFabricationData) {
      formik.setValues({
        order_id: `${OrderFabricationData[0].order_fabrication_control}`,
        article_id: OrderFabricationData[0].article_id,
        customer_name: OrderFabricationData[0].customer_id,
        pallet_count: `${OrderFabricationData[0].pallete_count}`,
      });
      setOrderArticleId(OrderFabricationData[0].article_id);
    }
  }, [OrderFabricationData]);

 
  const {
    data: ArticleData,
    error: ArticleError,
    isFetching: ArticleIsFetching,
  } = useQuery({
    queryKey: ['article-data-search', orderArticleId],
    queryFn: async () => {
      try {
        let headersList = {
          Accept: '*/*',
          'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        };
        let response = await fetch(
          `https://2track-qcms.vercel.app/api/v1/getonearticleprod?id=${orderArticleId}`,
          {
            method: 'GET',
            headers: headersList,
          }
        );

        let data = await response.json();
        return data;
      } catch (error) {
        throw new Error('Error');

        return error;
      }
    },
  });
 useEffect(() => {
    if (ArticleData && OrderFabricationData) {
      formik.setValues({
        order_id: `${OrderFabricationData[0].order_fabrication_control}`,
        article_id: OrderFabricationData[0].article_id,
        customer_name: OrderFabricationData[0].customer_id,
        pallet_count: `${OrderFabricationData[0].pallete_count}`,
      });
      console.log(ArticleError);
      if (!ArticleError) {
        setArticleId(`${ArticleData[0].article}`);
        setCustomerName(ArticleData[0].article_name);
      }
    }
  }, [ArticleData]);
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

        return data;
      }
    },
  });

  

  return order == '' ? (
    <></>
  ) : order !== '' && OrderFabricationIsFetching ? (
    <View className="flex flex-row items-center w-full h-full bg-blue-900 justify-items-center">
      <Feather name="loader" size={20} color="white" className="animate-spin" />
      <Text className="mx-auto my-auto text-lg text-white ">
        Fetching order fabrication
        <Text className="font-bold "> {order} </Text>
        data ...
      </Text>
    </View>
  ) : order !== '' && ArticleIsFetching ? (
    <View className="flex flex-row items-center w-full h-full bg-blue-900 justify-items-center">
      <Feather name="loader" size={20} color="white" className="animate-spin" />
      <Text className="mx-auto my-auto text-lg text-white ">Fetching article data</Text>
    </View>
  ) : order !== '' && OrderFabricationData ? (
    <View className="items-center justify-center flex-1 bg-white">
      <Text className="text-2xl font-bold text-gray-800">New Order Fabrication</Text>
      <FormikProvider value={formik}>
        <View className="w-full p-4">
          <InputText
            values={formik.values.order_id}
            handleChange={formik.handleChange('order_id')}
            errors={formik.errors.order_id}
            touched={formik.touched.order_id}
            placeholder="Order ID"
            textContentType="none"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            keyboardType="numeric"
          />

          <InputSearch
            setFieldValue={formik.setFieldValue}
            field="customer_name"
            values={customerName}
            errors={formik.errors.customer_name}
            touched={formik.touched.customer_name}
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
            ) : formik.values.customer_name !== '' && customerName !== '' ? (
              <></>
            ) : customerDataError && customerName !== '' ? (
              <View className="flex-row items-center justify-center mt-2">
                <Feather name="x" size={20} color="red" />
                <Text className="ml-2 text-red-500">Error fetching customer data</Text>
              </View>
            ) : customerDataIsFetching && customerName !== '' ? (
              <View className="flex-row items-center justify-center mt-2">
                <Feather name="loader" size={20} color="gray" className="animate-spin" />
                <Text className="ml-2 text-gray-600">Searching...</Text>
              </View>
            ) : customerData.data.length == 0 && customerName !== '' ? (
              <View className="flex-row items-center justify-center mt-2">
                <Feather name="x" size={20} color="red" />
                <Text className="ml-2 text-red-500">No customers found</Text>
              </View>
            ) : (
              customerData.data.map((customer: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center p-2 border-b border-gray-200"
                  onPress={() => {
                    if (customerName !== customer.company_name) {
                      formik.setFieldValue('customer_name', customer.id);
                      setCustomerName(customer.company_name);
                    } else {
                      formik.setFieldValue('customer_name', customer.id);
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
            setFieldValue={formik.setFieldValue}
            field="article_id"
            values={articleId}
            errors={formik.errors.article_id}
            touched={formik.touched.article_id}
            onChangeText={setArticleId}
            placeholder="Article ID"
            textContentType="number"
            keyboardType="numeric"
            autoCapitalize="words"
            autoCorrect={false}
            autoComplete="name">
            {articleId == '' ? (
              <></>
            ) : formik.values.article_id !== '' && articleId !== '' ? (
              <></>
            ) : articleIdDataError && articleId !== '' ? (
              <View className="flex-row items-center justify-center mt-2">
                <Feather name="x" size={20} color="red" />
                <Text className="ml-2 text-red-500">Error fetching customer data</Text>
              </View>
            ) : articleIdDataIsFetching && articleId !== '' ? (
              <View className="flex-row items-center justify-center mt-2">
                <Feather name="loader" size={20} color="gray" className="animate-spin" />
                <Text className="ml-2 text-gray-600">Searching...</Text>
              </View>
            ) : articleIdData.data.length == 0 && articleId !== '' ? (
              <View className="flex-row items-center justify-center mt-2">
                <Feather name="x" size={20} color="red" />
                <Text className="ml-2 text-red-500">No articles found</Text>
              </View>
            ) : (
              articleIdData.data.map((article: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center p-2 border-b border-gray-200"
                  onPress={() => {
                    if (article.article.toString() !== articleId) {
                      formik.setFieldValue('article_id', article.id);
                      setArticleId(article.article.toString());
                    } else {
                      formik.setFieldValue('article_id', article.id);
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
            values={formik.values.pallet_count}
            handleChange={formik.handleChange('pallet_count')}
            errors={formik.errors.pallet_count}
            touched={formik.touched.pallet_count}
            placeholder="Pallet Count"
            textContentType="none"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            keyboardType="numeric"
          />
          <View className="mt-4">
            <Pressable
              onPress={() => formik.handleSubmit()}
              className="w-full p-3 text-white rounded-lg bg-blue-custom-1">
              {formik.isSubmitting ? (
                <View className="flex-row items-center justify-center">
                  <Feather name="loader" size={20} color="white" className="animate-spin" />
                  <Text className="ml-2 text-white">Updating...</Text>
                </View>
              ) : (
                <Text className="text-lg font-medium text-center text-white">Update</Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => navigation.replace('OrderFabricationList')}
              className="w-full p-3 mt-2 text-gray-700 border border-gray-300 rounded-lg">
              <Text className="text-lg font-medium text-center text-gray-700">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </FormikProvider>
    </View>
  ) : (
    <></>
  );
};
