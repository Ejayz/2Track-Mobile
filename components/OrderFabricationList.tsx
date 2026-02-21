import { useNavigation } from '@react-navigation/native';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StatusBar,
  BackHandler,
  Alert,
  Modal,
} from 'react-native';
import configRetriver from 'utils/configRetriver';
import Feather from '@expo/vector-icons/Feather';
import { SearchState } from './FormComponents/SearchState';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { datePickerImperative } from 'utils/datePickerImperative';
export const OrderFabricationList = () => {
  const navigation: any = useNavigation();

  const [configurationData, setAuthenticationData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDateFrom, setSearchDateFrom] = useState<Date>(new Date());
  const [searchDateTo, setSearchDateTo] = useState<Date>(new Date());
  const [modalShow, setModalShow] = useState(false);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('desc');
  const [sortBy, setOrderBy] = useState('ofid');
  useEffect(() => {
    const fetchAuthenticationData = async () => {
      const ret = await configRetriver();

      setAuthenticationData(ret);
    };
    fetchAuthenticationData();
  }, []);

  const {
    data: ofdata,
    isLoading: ofisLoading,
    error: oferror,
    isFetching: ofisFetching,
    refetch: ofrefetch,
  } = useQuery({
    queryKey: [
      'order-fabrication-list',
      configurationData !== null && searchQuery,
      searchDateFrom,
      searchDateTo,
      page,
    ],
    queryFn: async () => {
      let headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      };
      const url =
        searchDateFrom && searchDateTo
          ? `${configurationData.api_url}/api/v1/get_order?page=1&search=${searchQuery}&date_from=${searchDateFrom}&date_to=${searchDateTo}&limit=10&page=${page}&sortBy=${sortBy}&order=${order}`
          : `${configurationData.api_url}/api/v1/get_order?page=1&search=${searchQuery}&limit=10&page=${page}&sortBy=${sortBy}&order=${order}`;
      let response = await fetch(url, {
        method: 'GET',
        headers: headersList,
      });

      let data = await response.json();

      return data;
    },
  });

  const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
    navigation.replace('Dashboard');
    return true;
  });

  const mutateOfData = useMutation({
    mutationKey: ['mutate-order-fabrication-list'],
    mutationFn: async (payload: any) => {
      console.log('Payload for mutation:', payload);
      let headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      };

      let response = await fetch(
        `https://2track-qcms.vercel.app/api/v1/remove_order?id=${payload.id}`,
        {
          method: 'DELETE',
          headers: headersList,
        }
      );

      let data = await response.json();
      console.log(data, 'order fabrication list data');
      if (data.error) {
        Alert.alert('Error', 'Failed to remove order fabrication');
        throw new Error('Failed to remove order fabrication');
      } else {
      }
    },
    onSuccess: () => {
      Alert.alert('Success', 'Order fabrication removed successfully');
      ofrefetch();
    },
  });

  return (
    <View className="items-center justify-center flex-1 w-full h-full text-black bg-blue-900">
      <View className="flex flex-row items-center justify-between mt-8">
        <Text className="text-xl font-bold text-white">Order Fabrication Management</Text>
      </View>
      <View className="flex flex-row items-center justify-between w-11/12 mt-6">
        <SearchState
          placeholder="Enter search query"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable
          onPress={() => {
            setModalShow(true);
          }}
          className="flex items-center justify-center flex-1 w-32 h-12 mx-1 text-center bg-gray-500 border-2 border-gray-500 rounded-lg ">
          <Text className="w-full text-lg font-medium text-center text-white ">Filters</Text>
        </Pressable>
        <Modal
          visible={modalShow}
          animationType="slide"
          transparent
          onRequestClose={() => {
            setModalShow(true);
          }}>
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#0006' }}>
            <View style={{ margin: 20, padding: 20, backgroundColor: 'white', height: '70%' }}>
              <Text className="w-full p-2 font-sans text-2xl font-bold text-center">Filters</Text>
              <Pressable
                onPress={() => {
                  datePickerImperative(searchDateFrom, setSearchDateFrom, 'date', false, 'From');
                  setModalShow(false);
                }}
                className="flex items-center justify-center w-full h-12 my-2 text-center bg-gray-500 border-2 border-gray-500 rounded-lg ">
                <Text className="w-full text-lg font-medium text-center text-white ">
                  From Date: {searchDateFrom.toDateString()}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  datePickerImperative(searchDateTo, setSearchDateTo, 'date', false, 'To');
                  setModalShow(false);
                }}
                className="flex items-center justify-center w-full h-12 my-2 text-center bg-gray-500 border-2 border-gray-500 rounded-lg ">
                <Text className="w-full text-lg font-medium text-center text-white ">
                  To Date: {searchDateTo.toDateString()}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setModalShow(false);
                }}
                className="flex items-center justify-center w-full h-12 my-2 text-center rounded-lg bg-blue-custom-1 ">
                <Text className="w-full text-lg font-medium text-center text-white ">Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          onPress={() => {
            navigation.replace('NewOrderFabrication');
          }}
          className="flex items-center justify-center flex-1 w-24 h-12 mx-1 my-auto text-center rounded-lg bg-blue-custom-1 ">
          <Text className="w-full text-lg font-medium text-center text-white ">Add</Text>
        </Pressable>
      </View>
      <ScrollView className="w-11/12 mx-auto text-left">
        {ofisLoading || ofisFetching ? (
          <View className="flex-row items-center justify-center mt-2">
            <Feather name="loader" size={24} color={'white'} className="ml-2 animate-spin" />
            <Text>Loading customer data...</Text>
          </View>
        ) : oferror ? (
          <Text>Error fetching customer data: {oferror.message}</Text>
        ) : (
          ofdata && (
            <View>
              {ofdata.data.map((customer: any) => {
                return (
                  <View key={customer.id} className="w-full p-2 mt-2 bg-white rounded-lg shadow ">
                    <Text className="text-lg font-medium text-gray-800">
                      {customer.order_fabrication_control}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Company:{customer.tbl_customer.company_name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Designation: {customer.tbl_article?.designation_article ?? 'N/A'}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Pallete: {customer.pallete_count ?? 'N/A'}
                    </Text>
                    <View className="flex flex-row items-start ">
                      <Text className="flex-1 text-sm text-gray-600">
                        Entry Date: {customer.entry_date_time ?? 'N/A'}
                      </Text>
                      <Text className="flex-1 text-sm text-gray-600">
                        Exit Date: {customer.exit_date_time ?? 'N/A'}
                      </Text>
                    </View>
                    <View className="flex flex-row items-start ">
                      <Pressable
                        onPress={async () => {
                          navigation.replace('EditOrderFabrication', {
                            order: customer.id,
                          });
                        }}
                        className="flex items-center justify-center flex-1 w-32 h-10 mx-4 mt-2 text-center rounded-lg bg-blue-custom-1 ">
                        <Text className="w-full text-sm font-medium text-center text-white ">
                          Edit
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          Alert.alert(
                            'Confirm Deletion',
                            'Are you sure you want to delete this order fabrication?',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel',
                              },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => {
                                  mutateOfData.mutate({ id: customer.id });
                                },
                              },
                            ]
                          );
                        }}
                        disabled={
                          mutateOfData.isPending && mutateOfData.variables?.id === customer.id
                        }
                        className="flex items-center justify-center flex-1 w-32 h-10 mx-4 mt-2 text-center border-2 border-red-500 border-solid rounded-lg ">
                        {mutateOfData.isPending && mutateOfData.variables?.id === customer.id ? (
                          <View className="flex-row items-center justify-center">
                            <Feather
                              name="loader"
                              size={20}
                              color={'red'}
                              className="ml-2 animate-spin"
                            />
                            <Text className="ml-2 text-sm font-medium text-center text-red-500">
                              Deleting...
                            </Text>
                          </View>
                        ) : (
                          <Text className="w-full text-sm font-medium text-center text-red-500 ">
                            Delete
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )
        )}
        <View className="flex flex-row w-auto mx-auto mt-4 mb-4 justify-items-center ">
          <Pressable
            onPress={() => {
              if (page != 1) {
                setPage(page - 1);
              }
            }}
            className="w-auto p-4 text-center bg-blue-500 justify-items-center">
            <Text className="text-lg font-bold text-center ">Prev</Text>
          </Pressable>
          <Text></Text>
          <Pressable
            onPress={() => {
              setPage(page + 1);
            }}
            className="w-auto p-4 text-center bg-blue-500 ">
            <Text className="text-lg font-bold text-center">Next</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};
