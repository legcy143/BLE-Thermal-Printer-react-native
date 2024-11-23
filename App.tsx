import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Routes} from './routes/StackNavigator';
import Toast from 'react-native-toast-message';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <Routes />
          <Toast />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
