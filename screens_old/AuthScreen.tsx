import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors, fonts} from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';
import KeyboardHideWrapper from '../components/KeyboardHideWrapper';
import useAuthStore from '../store/useAuthStore';

const AuthScreen = () => {
  const {isAuthenticated, loading, login, user, setUser} = useAuthStore();
  if(loading){
    return <Text>Loading...</Text>
  }
  return (
    <KeyboardHideWrapper>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 40,
            fontFamily: fonts.GilroyExtrabold,
            color: 'black',
            marginTop: 100,
          }}>
          GoKaptureHub
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: fonts.GilroyMedium,
            color: 'black',
            marginBottom: 20,
          }}>
          Event Registration Scanner
        </Text>
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 22,
              fontFamily: fonts.GilroyExtrabold,
              color: 'black',
              textAlign: 'center',
            }}>
            Login to your GoKaptureHub Account
          </Text>

          <View
            style={{
              flexDirection: 'column',
              width: '80%',
              marginVertical: 20,
            }}>
            <Input
              value={user.email}
              onChangeText={email => setUser({email, password: user.password})}
              label="Enter your Registered email"
              placeholder="Email Address"
              type="email-address"
            />
            <Input
              value={user.password}
              onChangeText={password => setUser({email: user.email, password})}
              label="Enter your Password"
              placeholder="Password"
              type="visible-password"
            />
            <Button
              loading={loading}
              text="Login to GoKaptureHub"
              onPress={() => login()}
            />
          </View>
        </View>
      </View>
    </KeyboardHideWrapper>
  );
};

export default AuthScreen;
