import {View, Text} from 'react-native';
import React from 'react';
import useAuthStore from '../../../store/useAuthStore';
import ButtonUI from '../../_components/ButtonUI';
import {showToast} from '../../../helper/toast';

export default function Header({navigation}: any) {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  return (
    <View
      style={{
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderColor: 'rgba(0,0,0,0.2)',
      }}>
      <View>
        <Text style={{fontWeight: '600', fontSize: 25, color: 'black'}}>
          Events
        </Text>
        <Text style={{textTransform: 'capitalize'}}>{user?.email}</Text>
      </View>
      <View>
        <ButtonUI
          onPress={async () => {
            let res = await logout();
            if (res) navigation.replace('LoginScreen');
          }}>
          Log out
        </ButtonUI>
      </View>
    </View>
  );
}
