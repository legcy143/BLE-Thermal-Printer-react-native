import Toast from 'react-native-toast-message';

export const showToast = (
  type: 'success' | 'error' | 'info' | 'any',
  message: string,
  duration?: number,
) => {
  Toast.show({
    visibilityTime: duration || 5000,
    type,
    text1: message,
    text2: type === 'error' ? 'Please try again, as Something Went Wrong.' : '',
    text1Style: {
      // captlize the first letter of the message
      textTransform: 'capitalize',
    }
  });
};
