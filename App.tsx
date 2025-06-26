import './global.css';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from 'components/LoginScreen';
import { createStaticNavigation } from '@react-navigation/native';
import { DataValidation } from 'components/DataValidation';
import { Dashboard } from 'components/Dashboard';

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
    Dashboard: {
      screen: Dashboard, // Placeholder for Dashboard screen
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
