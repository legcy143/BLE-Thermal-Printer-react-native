import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  KeyboardAvoidingView,
} from 'react-native';

type KeyboardHideWrapperProps = {
  children: React.ReactNode;
};

const KeyboardHideWrapper = ({children}: KeyboardHideWrapperProps) => {
  return (
    <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default KeyboardHideWrapper;
