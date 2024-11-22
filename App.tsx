import React, {useEffect} from 'react';
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AuthScreen from './screens/AuthScreen';
import Toast from 'react-native-toast-message';
import EventListScreen from './screens/EventListScreen';
import useAuthStore from './store/useAuthStore';
import ConnectPrinterScreen from './screens/ConnectPrinterScreen';

export type RootStackParamList = {
  Navigation: undefined;
};

const App = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const {checkIsAuthenticated} = useAuthStore();

  useEffect(() => {
    checkIsAuthenticated();
    StatusBar.setBackgroundColor('#fff');
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Navigation" component={Navigation} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export type NavigationStackParamList = {
  Auth: undefined;
  EventList: undefined;
  ConnectPrinter: undefined;
};

const Navigation = () => {
  const {getUser, isAuthenticated} = useAuthStore();
  const Stack = createNativeStackNavigator<NavigationStackParamList>();
  const router = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.name !== 'Auth') {
      getUser();
    }
  }, [route.name]);

  useEffect(() => {
    if (isAuthenticated) {
      router.navigate('EventList' as never);
    }
  }, [isAuthenticated]);

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'ConnectPrinter' : 'Auth'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="ConnectPrinter" component={ConnectPrinterScreen} />
      <Stack.Screen name="EventList" component={EventListScreen} />
    </Stack.Navigator>
  );
};

export default App;
