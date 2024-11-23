import {View, Text, Button} from 'react-native';
import React, {useEffect} from 'react';
import {showToast} from '../../helper/toast';
import useAuthStore from '../../store/useAuthStore';
import {useNavigation} from '@react-navigation/native';

export default function SplashScreen({navigation}: any) {
  const isFetchLoading = useAuthStore(s => s.isFetchLoading);
  const getUser = useAuthStore(s => s.getUser);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    const fetchUserAndNavigate = async () => {
      if (user) {
        navigation?.replace('EventScreen');
      } else {
        let res = await getUser();
        if (!res) {
          navigation.replace('LoginScreen');
        } else {
          navigation?.replace('EventScreen');
        }
      }
    };
    fetchUserAndNavigate();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 40, fontWeight: '600', color: 'black'}}>
        Gokapturehub
      </Text>
      <Text>registration</Text>
      <Text>{isFetchLoading ? 'Loading...' : ''}</Text>
    </View>
  );
}
