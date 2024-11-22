import {View, Text, TextInput} from 'react-native';
import React from 'react';
import {colors, fonts} from '../constants';

type InputProps = {
  placeholder: string;
  label: string;
  type: TextInput['props']['keyboardType'];
  value?: string;
  onChangeText?: (value: string) => void;
};

const Input: React.FC<InputProps> = ({
  label,
  onChangeText,
  placeholder,
  type = 'default',
  value,
}) => {
  return (
    <View style={{marginVertical: 10}}>
      <Text
        style={{
          fontSize: 20,
          fontFamily: fonts.GilroySemibold,
          color: 'black',
          marginBottom: 5,
        }}>
        {label}
      </Text>
      <TextInput
        value={value}
        keyboardType={type}
        onChangeText={onChangeText}
        style={{
          borderRadius: 14,
          padding: 10,
          width: '100%',
          backgroundColor: '#f2f2f2',
          color: 'black',
          fontFamily: fonts.GilroyMedium,
          fontSize: 16,
          elevation: 1.2,
        }}
        placeholderTextColor={colors.textColor}
        placeholder={placeholder}
      />
    </View>
  );
};

export default Input;
