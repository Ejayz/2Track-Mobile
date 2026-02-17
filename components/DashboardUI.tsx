import { View, Text, Button, Image, StyleSheet, Pressable, StatusBar } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import authenticationRetriver from 'utils/authenticationRetriver';
import { useEffect, useState } from 'react';
const corexlogo = require('../assets/img/corex1.png');
import { useNavigation } from '@react-navigation/native';
export const DashboardUI = () => {
  const navigation: any = useNavigation();

  const [authenticationData, setAuthenticationData] = useState<any>(null);
  useEffect(() => {
    const fetchAuthenticationData = async () => {
      const ret = await authenticationRetriver();
      setAuthenticationData(ret);
      console.log('Fetched authentication data:', authenticationData.db_record.first_name);
    };
    fetchAuthenticationData();
  }, []);

  return (
    <View className="items-center justify-center flex-1 w-full h-full text-black bg-blue-900">
      <Image source={corexlogo} style={styles.logo} resizeMode="contain" />
      <Text className="text-xl font-bold text-white">
        {authenticationData == null
          ? ''
          : `Good day 🌞,  ${authenticationData.db_record.last_name}`}
      </Text>
      <Text className="w-3/4 mt-4 mb-2 text-base text-center text-gray-300">
        Lets get you started with managing CoreX. Please select one of the options below to begin.
      </Text>
      <View className="flex flex-col justify-center gap-6 mt-5 ">
        <Pressable
          onPress={() => {
            navigation.navigate('CustomerManagement');
          }}
          className="flex flex-row w-3/4 h-auto p-2 text-center rounded-lg bg-blue-custom-1 ">
          <Text className="w-full text-lg font-medium text-center text-white ">
            Customer Management
          </Text>
        </Pressable>

        <Pressable className="flex flex-row w-3/4 h-auto p-2 text-center rounded-lg bg-blue-custom-1 ">
          <Text className="w-auto mx-auto text-lg font-medium text-center text-white">
            Article Creation
          </Text>
        </Pressable>
        <Pressable
          className="flex flex-row w-3/4 h-auto p-2 text-center rounded-lg bg-blue-custom-1 "
          onPress={() => {
            navigation.replace('OrderFabricationList');
          }}>
          <Text className="w-auto mx-auto text-lg font-medium text-center text-white">
            Order Fabrication Management
          </Text>
        </Pressable>
        <Pressable className="flex flex-row w-3/4 h-auto p-2 text-center rounded-lg bg-blue-custom-1 ">
          <Text className="w-auto mx-auto text-lg font-medium text-center text-white">
            Statistical Analysis
          </Text>
        </Pressable>
      </View>
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
