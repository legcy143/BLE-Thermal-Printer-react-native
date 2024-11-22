import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';
import {colors, fonts} from '../constants';

type ButtonProps = {
  onPress?: () => void;
  text: string;
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({text, onPress, loading}) => {
  return (
    <TouchableOpacity
      disabled={loading}
      activeOpacity={0.8}
      style={{
        width: '100%',
        padding: 10,
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#15151a',
        marginVertical: 10,
        opacity: loading ? 0.5 : 1,
        flexDirection: 'row',
        gap: 10,
      }}
      onPress={onPress}>
      {loading && <ActivityIndicator color={colors.darkTextColor} />}
      <Text
        style={{
          fontSize: 20,
          fontFamily: fonts.GilroySemibold,
          color: colors.darkTextColor,
          textAlign: 'center',
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
