import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import InputUI from '../_components/InputUI';
import ButtonUI from '../_components/ButtonUI';
import KeyboardHideWrapper from '../../components/KeyboardHideWrapper';
import {theme} from '../theme';
import useAuthStore from '../../store/useAuthStore';

export default function LoginScreen({navigation}: any) {
  const login = useAuthStore(s => s.login);
  const userLoginPayload = useAuthStore(s => s.userLoginPayload);
  const setUserLoginPayload = useAuthStore(s => s.setUserLoginPayload);
  const isLoginLoading = useAuthStore(s => s.isLoginLoading);

  const handleLogin = async () => {
    let res = await login();
    if (res) {
      navigation?.replace('EventScreen');
    }
  };

  return (
    <KeyboardHideWrapper>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.color.background,
        }}>
        <View style={{width: '80%'}}>
          <Text
            style={{
              fontSize: 35,
              color: theme.color.black,
              fontWeight: '700',
              textAlign: 'center',
            }}>
            Gokapturehub
          </Text>
          <Text style={{fontSize: 15, fontWeight: '700', textAlign: 'center'}}>
            Login
          </Text>
          <InputUI
            label="Email"
            placeholder="abc@gmail"
            value={userLoginPayload.email}
            onChangeText={e => {
              setUserLoginPayload({email: e});
            }}
          />
          <InputUI
            label="Password"
            placeholder="****"
            value={userLoginPayload.password}
            onChangeText={e => {
              setUserLoginPayload({password: e});
            }}
          />
          <ButtonUI disabled={isLoginLoading} onPress={handleLogin}>Login</ButtonUI>
        </View>
      </View>
    </KeyboardHideWrapper>
  );
}
