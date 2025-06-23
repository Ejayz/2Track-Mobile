import './global.css';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from 'components/LoginScreen';
import { createStaticNavigation } from '@react-navigation/native';
import { DataValidation } from 'components/DataValidation';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'LoginScreen',
  screens: {
    LoginScreen: {
      screen: LoginScreen,
      options: {
        headerShown: false,
      },
    },
    DataValidation: {
      screen: DataValidation,
      options: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <>
      <Navigation />
    </>
  );
}
