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

export const MeasurementList = ({ route }: any) => {
  const navigation: any = useNavigation();
  const [configurationData, setAuthenticationData] = useState<any>(null);

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
    queryKey: ['measurement-list', route.params.order],
    queryFn: async () => {
      const ConfigData = await configRetriver();

      let headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      };
      const url = `${ConfigData.api_url}/api/v1/getonemeasurementprod?ofid=${route.params.order}`;
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
    mutationKey: ['mutate-measurement-list'],
    mutationFn: async (payload: any) => {
      console.log('Payload for mutation:', payload);
      let headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      };
      const ConfigData = await configRetriver();
      let response = await fetch(
        `${ConfigData.api_url}/api/v1/remove_measurement?id=${payload.id}`,
        {
          method: 'PUT',
          headers: headersList,
        }
      );

      let data = await response.json();
      console.log(data, 'order fabrication list data');
      console.log(data);
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
      <View className="flex flex-row items-center justify-between w-11/12 mt-8">
        <Text className="text-xl font-bold text-white">PALLET MEASUREMENT</Text>
        <Pressable
          onPress={() => {
            navigation.replace('OrderFabricationList');
          }}
          className="flex items-center justify-center w-24 h-12 mx-1 my-auto text-center rounded-lg bg-blue-custom-1 ">
          <Text className="w-full text-lg font-medium text-center text-white ">BACK</Text>
        </Pressable>
      </View>
      <ScrollView className="w-11/12 pb-4 mx-auto text-left">
        {ofisLoading || ofisFetching ? (
          <View className="flex-row items-center justify-center mt-2">
            <Feather name="loader" size={24} color={'white'} className="ml-2 animate-spin" />
            <Text>Loading customer data...</Text>
          </View>
        ) : oferror ? (
          <Text>Error fetching customer data: {oferror.message}</Text>
        ) : ofdata.length == 0 ? (
          <View className="flex-row items-center justify-center mt-2">
            {/* <Feather name="loader" size={24} color={'white'} className="ml-2 animate-spin" /> */}
            <Text>No measurement data found.</Text>
          </View>
        ) : (
          ofdata && (
            <View>
              {ofdata.map((customer: any) => {
                return (
                  <View key={customer.id} className="w-full p-2 mt-2 bg-white rounded-lg shadow ">
                    <Text className="text-lg font-medium text-gray-800">
                      Pallete # : {customer.palette_num}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Length: {customer.length ?? 'N/A'}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Inside Diameter: {customer.inside_diameter ?? 'N/A'}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Outside Diameter: {customer.outside_diameter ?? 'N/A'}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Flat Crush: {customer.flat_crush ?? 'N/A'}
                    </Text>
                    <Text className="text-sm text-gray-600">H20: {customer.h2o ?? 'N/A'}</Text>
                    <Text className="text-sm text-gray-600">
                      Remarks: {customer.remarks ?? 'N/A'}
                    </Text>
                    <View className="flex flex-row items-start ">
                      <Pressable
                        onPress={async () => {
                          navigation.replace('EditMeasurement', {
                            id: customer.id,
                            length: customer.length,
                            inside_diameter: customer.inside_diameter,
                            outside_diameter: customer.outside_diameter,
                            flat_crush: customer.flat_crush,
                            h20: customer.h2o,
                            number_control: 0,
                            remarks: customer.remarks,
                            pallete_count: parseInt(customer.palette_num),
                            user_id: null,
                            order: route.params.order,
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
      </ScrollView>
      <Pressable
        onPress={() => {
          navigation.replace('NewMeasurement', {
            ofid: route.params.ofid,
            order: route.params.order,
          });
        }}
        className="w-auto p-4 mt-2 mb-4 text-center bg-blue-500 rounded-lg ">
        <Text className="text-lg font-bold text-center text-white">ADD MEASUREMENT</Text>
      </Pressable>
    </View>
  );
};
