import { View, Text, TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import React from 'react';
import { theme } from '../theme';

interface ButtonUIProps extends TouchableOpacityProps {
  children: React.ReactNode;
  disabled?: boolean; 
}

export default function ButtonUI({ children, disabled, ...props }: ButtonUIProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.6} 
      style={[styles.btn, disabled ? styles.disabledBtn : {}]} 
      disabled={disabled} 
      {...props}
    >
      <Text style={[styles.txt, disabled ? styles.disabledText : {}]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 100,
    fontSize: 10,
    backgroundColor: theme.color.primary,
    alignItems:"center",
    justifyContent: "center"
  },
  txt: {
    fontWeight: '500',
    textTransform: 'capitalize',
    color: theme.color.white, 
  },
  disabledBtn: {
    opacity:0.8
  },
  disabledText: {
    opacity:0.8
  },
});
