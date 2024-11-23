import {View, Text} from 'react-native';
import React from 'react';
import Header from './_components/Header';
import EventList from './_components/EventList';

export default function EventScreen({navigation}:any) {
  return (
    <View>
      <Header navigation={navigation}/>
      <EventList />
    </View>
  );
}
