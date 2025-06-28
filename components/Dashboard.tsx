import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { NewOrderFabrication } from './NewOrderFabrication';
import { OrderFabricationList } from './OrderFabricationList';
import { createStaticNavigation } from '@react-navigation/native';
import { DashboardUI } from './DashboardUI';
import { Feather } from '@expo/vector-icons';
import { Settings } from './Settings';

export const Dashboard = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator initialRouteName="NewOrderFabrication">
      <Tab.Screen
        name="DashboardUI"
        component={DashboardUI}
        options={{
          headerShown: false,
          tabBarLabel: 'Dashboard',
          tabBarIcon: () => <Feather name="menu" size={24} color="black" />,
        }}
      />
      <Tab.Screen
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
      />
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
