import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';

import './global.css';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from 'components/LoginScreen';
import { createStaticNavigation } from '@react-navigation/native';

const RootStack= createStackNavigator({
  initialRouteName: 'LoginScreen',
  screens:{
    LoginScreen:{
      screen:LoginScreen,
      options: {
        headerShown: false,
      },
    }
  }
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <>
     <Navigation />
    </>
  );
}
