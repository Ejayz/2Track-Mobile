import './global.css';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from 'components/LoginScreen';
import { createStaticNavigation } from '@react-navigation/native';
import { DataValidation } from 'components/DataValidation';
import { Dashboard } from 'components/Dashboard';
import { ConfigurationSetup } from 'components/ConfigurationSetup';
import { CustomerManagement } from 'components/CustomerManagement';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
    ConfigurationSetup: {
      screen: ConfigurationSetup, // Placeholder for ConfigurationSetup screen
      options: {
        headerShown: false,
      },
    },
    CustomerManagement: {
      screen: CustomerManagement, // Placeholder for CustomerManagement screen
      options: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);
const queryClient = new QueryClient();
export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Navigation />
      </QueryClientProvider>
    </>
  );
}
