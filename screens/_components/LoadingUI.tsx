import {View, Text, ActivityIndicator, ViewProps} from 'react-native';
import React from 'react';
import {theme} from '../theme';

interface LoadingUIProps extends ViewProps {
  message?: string;
  size?: number;
}

export default function LoadingUI({message, size, ...props}: LoadingUIProps) {
  return (
    <View style={{alignItems: 'center'}} {...props}>
      <ActivityIndicator size={size ?? 40} />
      {message && (
        <Text
          style={{color: theme.color.black, fontWeight: '500', fontSize: 15}}>
          {message}
        </Text>
      )}
    </View>
  );
}
