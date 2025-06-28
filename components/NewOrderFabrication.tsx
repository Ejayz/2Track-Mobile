import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  GestureResponderEvent,
  TouchableOpacity,
} from 'react-native';
import { InputSearch } from './FormComponents/InputSearch';
import { InputText } from './FormComponents/InputText';
import Feather from '@expo/vector-icons/Feather';
import { number } from 'yup';
export const NewOrderFabrication = () => {


    //Customer Name
  const [customerSearching, setCustomerSearching] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerNamesResults, setCustomerNamesResults] = useState<string[]>([]);
  const [isCustomerNameSearching, setIsCustomerNameSearching] = useState<boolean>(false);


//Product Name

const [productNameSearching,setProductNameSearching] = useState(false);
const [productName,setProductName] = useState("")
const [productNameResults,setProductNameResults]=useState([])
const [isProductNameSearching,setIsProductNameSearching]= useState(false)

  useEffect(() => {
    const fetchCustomers = async () => {
      if (customerName == '') {
        setIsCustomerNameSearching(false);
        setCustomerNamesResults([]);
        setCustomerSearching(false);
        return;
      }
      setIsCustomerNameSearching(true);
      let headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      };

      let response = await fetch(
        `https://www.sledgehammerdevelopmentteam.uk/api/mobile/getCustomerList?search=${customerName}`,
        {
          method: 'GET',
          headers: headersList,
        }
      );

      let data = await response.json();
      setCustomerNamesResults(data.data || []);
      setIsCustomerNameSearching(false);
    };
    if (!customerSearching) {
      fetchCustomers();
    }
  }, [customerName, customerSearching]);

  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text className="text-2xl font-bold text-gray-800">New Order Fabrication</Text>
      <Formik
        initialValues={{ order_id: '', pallet_count: '', customer_name: '', product_name: '' }}
        onSubmit={(values) => {
          console.log(values);
        }}>
        {({ handleChange, handleSubmit, values, errors, touched }) => (
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
              keyboardType="default"
            />
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
              keyboardType="default"
            />
            <InputSearch
              values={customerName}
              onChangeText={(text: string) => {
                setCustomerName(text);
                setCustomerSearching(false);
              }}
              placeholder="Customer Name"
              textContentType="name"
              keyboardType="default"
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
              isSearching={isCustomerNameSearching}>
              {customerNamesResults.map((customer: any, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center p-2 border-b border-gray-200"
                  onPress={() => {
                    values.customer_name = customer.id;
                    setCustomerName(customer.company_name);
                    setCustomerSearching(true);
                    setCustomerNamesResults([]);
                  }}>
                  <Feather name="search" size={20} color="gray" />
                  <View className="ml-2">
                    <Text className="font-semibold text-gray-700">{customer.company_name}</Text>
                    <Text className="text-xs text-gray-500">Code: {customer.id}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </InputSearch>
            <InputSearch
              values={productName}
              onChangeText={setProductName}
              placeholder="Product Name"
              textContentType="name"
              keyboardType="default"
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
              isSearching={isProductNameSearching}
              >
                 {productNameResults.map((product_name: any, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center p-2 border-b border-gray-200"
                  onPress={() => {
                    values.customer_name = product_name.id;
                    setCustomerName(product_name.company_name);
                    setCustomerSearching(true);
                    setCustomerNamesResults([]);
                  }}>
                  <Feather name="search" size={20} color="gray" />
                  <View className="ml-2">
                    <Text className="font-semibold text-gray-700">{product_name.company_name}</Text>
                    <Text className="text-xs text-gray-500">Code: {product_name.id}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              </InputSearch>

            <View className="mt-4">
              <Button
                onPress={handleSubmit as unknown as (e: GestureResponderEvent) => void}
                title="Submit Order Fabrication"
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};
