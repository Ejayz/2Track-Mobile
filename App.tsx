import './global.css';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from 'components/LoginScreen';
import { createStaticNavigation } from '@react-navigation/native';

const RootStack= createNativeStackNavigator({
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
