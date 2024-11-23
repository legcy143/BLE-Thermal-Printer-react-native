import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect} from 'react';
import useEventStore, {
  RegistrationInterface,
} from '../../../store/useEventStore';
import LoadingUI from '../../_components/LoadingUI';
import {colors, fonts} from '../../../constants';
import { theme } from '../../theme';

export default function EventList() {
  const events = useEventStore(s => s.events);
  const getEvents = useEventStore(s => s.getEvents);
  const isFetchLoading = useEventStore(s => s.isFetchLoading);

  useEffect(() => {
    if (!events) {
      getEvents();
    }
  }, []);

  if (isFetchLoading) {
    return <LoadingUI style={{paddingVertical:100,alignItems:"center",gap:15}} message='Loading your events'/>;
  }
  return (
    <View>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        ListEmptyComponent={
          <Text>No Events , go to the dashbaord and creaate new Events</Text>
        }
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const renderEventItem = ({item}: {item: RegistrationInterface}) => (
  <TouchableOpacity activeOpacity={0.8} style={styles.eventContainer}>
    <View style={styles.eventInfoContainer}>
      <Text style={styles.eventDate}>
        {new Date(item?.eventDate?.start).toLocaleDateString()}
      </Text>
    </View>
    {item.logo && <Image source={{uri: item.logo}} style={styles.eventLogo} />}
    <Text style={styles.eventName}>{item?.name}</Text>
    <Text style={styles.eventType}>{item?.eventType}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontFamily: fonts.GilroyExtrabold,
    color: colors.textColor,
    marginTop: 30,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom:150,
    backgroundColor:theme.color.background
  },
  eventContainer: {
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    padding: 20,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    position: 'relative',
  },
  eventInfoContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'black',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  eventDate: {
    fontSize: 14,
    fontFamily: fonts.GilroyBold,
    color: 'white',
  },
  eventLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  eventName: {
    fontSize: 25,
    fontFamily: fonts.GilroyBold,
    color: colors.textColor,
  },
  eventType: {
    fontSize: 14,
    fontFamily: fonts.GilroyMedium,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
