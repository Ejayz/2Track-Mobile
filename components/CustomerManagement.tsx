import { View, Text, Button, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import authenticationRetriver from 'utils/authenticationRetriver';
import { useEffect, useState } from 'react';
const corexlogo = require('../assets/img/corex1.png');
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { InputSearch } from './FormComponents/InputSearch';
import { SearchState } from './FormComponents/SearchState';
export const CustomerManagement = () => {
  const navigation: any = useNavigation();

  const [authenticationData, setAuthenticationData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const fetchAuthenticationData = async () => {
      const ret = await authenticationRetriver();
      setAuthenticationData(ret);
    };
    fetchAuthenticationData();
  }, []);

  const {
    isPending: isCustomerDataPending,
    isFetching: isCustomerDataFetching,
    data: customerData,
    error: customerDataError,
  } = useQuery({
    queryKey: ['customerData', searchQuery],
    queryFn: async () => {
      let headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      };

      let response = await fetch(
        `https://2track-qcms.vercel.app/api/v1/get_customer?page=1&search=${searchQuery}&limit=10`,
        {
          method: 'GET',
          headers: headersList,
        }
      );

      let data = await response.json();
      console.log('Fetched customer data:', data);
      return data;
    },
  });

  return (
    <View className="items-center justify-center flex-1 w-full h-full text-black bg-blue-900">
      <View className="flex flex-row items-center justify-between w-full">
        <SearchState
          placeholder="Search customers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex items-center justify-center w-24 h-12 text-center rounded-lg bg-blue-custom-1 ">
          <Text className="w-full text-lg font-medium text-center text-white ">Back</Text>
        </Pressable>
      </View>
      <ScrollView className="w-full p-4 text-left">
        {isCustomerDataPending || isCustomerDataFetching ? (
          <View className="flex-row items-center justify-center mt-2">
            <Feather name="loader" size={24} color={'white'} className="ml-2 animate-spin" />
            <Text>Loading customer data...</Text>
          </View>
        ) : customerDataError ? (
          <Text>Error fetching customer data: {customerDataError.message}</Text>
        ) : (
          customerData && (
            <View>
              {customerData.data.map((customer: any) => (
                <View key={customer.id} className="w-full p-2 mt-2 bg-white rounded-lg shadow">
                  <Text className="text-lg font-medium text-gray-800">{customer.company_name}</Text>
                  <Text className="text-sm text-gray-600">Customer ID:{customer.customer_id}</Text>
                </View>
              ))}
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 200, // or '100%' to fit container width
    height: 100, // adjust based on your image aspect ratio
  },
  Button: {
    backgroundColor: '#00000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
