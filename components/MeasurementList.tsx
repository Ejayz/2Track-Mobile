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
import { forEach } from 'eslint.config';

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
      const data2 = await processData(data);

      return data2;
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
        Alert.alert('Error', 'Failed to remove pallete.');
        throw new Error('Failed to remove pallete.');
      } else {
      }
    },
    onSuccess: () => {
      Alert.alert('Success', 'Pallete deleted successfully');
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
        ) : ofdata?.length == 0 ? (
          <View className="flex-row items-center justify-center mt-2">
            {/* <Feather name="loader" size={24} color={'white'} className="ml-2 animate-spin" /> */}
            <Text>No measurement data found.</Text>
          </View>
        ) : (
          ofdata && (
            <View>
              {ofdata.map((customer: any, key: number) => {
                return (
                  <View key={key} className="w-full p-2 mt-2 bg-white rounded-lg shadow ">
                    <Text className="text-lg font-medium text-gray-800">
                      Pallete No.: {customer.palette_num}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {customer.items
                        .filter(
                          (item: any) =>
                            item.length !== null && item.length !== undefined && item.length !== ''
                        )
                        .map((item: any, key: any) => {
                          console.log(key, customer.items.length);
                          const incrementKey = key + 1;
                          return (
                            <>
                              <Text className="font-bold">{`Length ${incrementKey} :`}</Text>
                              <Text>{` ${item.length}${customer.items.length == incrementKey ? `` : `\r\n`}`}</Text>
                            </>
                          );
                        })}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      <Text className="font-bold">Inside Diameter: </Text>
                      {customer.items
                        .filter(
                          (item: any) =>
                            item.length !== null &&
                            item.inside_diameter !== undefined &&
                            item.inside_diameter !== ''
                        )
                        .map((item: any) => item.inside_diameter)}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      <Text className="font-bold">Outside Diameter: </Text>
                      {customer.items
                        .filter(
                          (item: any) =>
                            item.length !== null &&
                            item.outside_diameter !== undefined &&
                            item.outside_diameter !== ''
                        )
                        .map((item: any) => item.outside_diameter)}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      <Text className="font-bold">Flat Crush: </Text>
                      {customer.items
                        .filter(
                          (item: any) =>
                            item.length !== null &&
                            item.flat_crush !== undefined &&
                            item.flat_crush !== ''
                        )
                        .map((item: any) => item.flat_crush)}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      <Text className="font-bold">H20:</Text>
                      {customer.items
                        .filter(
                          (item: any) =>
                            item.length !== null && item.h2o !== undefined && item.h20 !== ''
                        )
                        .map((item: any) => item.h2o)}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      <Text className="font-bold">Remarks:</Text>
                      {customer.items
                        .filter(
                          (item: any) =>
                            item.length !== null &&
                            item.remarks !== undefined &&
                            item.flat_crush !== ''
                        )
                        .map((item: any) => item.remarks)}
                    </Text>
                    <View className="flex flex-row items-start ">
                      <Pressable
                        onPress={async () => {
                          navigation.replace('EditMeasurement', {
                            data: customer.items,
                            order: route.params.order,
                            pallete: customer.palette_num,
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
                            'Are you sure you want to delete this pallete? All measurement would be deleted.',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel',
                              },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => {
                                  customer.items.map((data: any, keys: any) => {
                                    mutateOfData.mutate({ id: data.id });
                                  });
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

async function processData(data: any[]) {
  const grouped = data.reduce(
    (acc, item) => {
      const { palette_num, ...rest } = item;

      const existing = acc.find((g: any) => g.palette_num === palette_num);

      if (existing) {
        existing.items.push(rest);
      } else {
        acc.push({
          palette_num,
          items: [rest],
        });
      }

      return acc;
    },
    [] as {
      palette_num: number;
      items: Omit<(typeof data)[number], 'palette_num'>[];
    }[]
  );
  return grouped;
}
