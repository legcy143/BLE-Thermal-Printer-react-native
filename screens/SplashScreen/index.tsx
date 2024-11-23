import {View, Text, Button} from 'react-native';
import React from 'react';
import {showToast} from '../../helper/toast';

export default function SplashScreen() {
  return (
    <View>
      <Text>SplashScreen</Text>
      <Button
        title="show toast"
        onPress={() => {
          showToast('success', 'bla bla');
        }}></Button>
    </View>
  );
}
