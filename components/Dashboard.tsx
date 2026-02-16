import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { NewOrderFabrication } from './NewOrderFabrication';
import { OrderFabricationList } from './OrderFabricationList';
import { createStaticNavigation } from '@react-navigation/native';
import { DashboardUI } from './DashboardUI';
import { Feather } from '@expo/vector-icons';
import { Settings } from './Settings';

export const Dashboard = ({route}:any) => {
  const params = route?.params;
  console.log('Dashboard received params:', params);
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator initialRouteName="DashboardUI" >
      <Tab.Screen
        name="DashboardUI"
        component={DashboardUI}
        initialParams={route}
        options={{
          headerShown: false,
          tabBarLabel: 'Menu',
          tabBarIcon: () => <Feather name="menu" size={24} color="black" />,

        }}
      />
      {/* <Tab.Screen
        name="NewOrderFabrication"
        component={NewOrderFabrication}
        options={{
          headerShown: false,
          tabBarLabel: 'New Order Fabrication',
          tabBarIcon: () => <Feather name="plus-square" size={24} color="black" />,
        }}
      />
      <Tab.Screen
        name="OrderFabricationList"
        component={OrderFabricationList}
        options={{
          headerShown: false,
          tabBarLabel: 'Orders Fabrication List',
          tabBarIcon: () => <Feather name="list" size={24} color="black" />,
        }}
      /> */}
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          tabBarLabel: 'Settings',
          tabBarIcon: () => <Feather name="settings" size={24} color="black" />,
        }}
      />
    </Tab.Navigator>
  );
};
