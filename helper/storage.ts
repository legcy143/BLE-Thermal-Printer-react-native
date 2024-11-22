import AsyncStorage from '@react-native-async-storage/async-storage';

// function to store data in async storage and retrieve data from async storage and delete data from async storage

export const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value
  } catch (e) {
    console.log(e);
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};
