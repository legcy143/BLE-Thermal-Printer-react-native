import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import useEventStore, {Event} from '../store/useEventStore';
import {colors, fonts} from '../constants';

const EventListScreen: React.FC = () => {
  const {getEvents, events, loading} = useEventStore();

  useEffect(() => {
    if (events.length === 0) {
      getEvents();
    }
  }, []);

  const renderEventItem = ({item}: {item: Event}) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.eventContainer}>
      <View style={styles.eventInfoContainer}>
        <Text style={styles.eventDate}>
          {new Date(item?.eventDate?.start).toLocaleDateString()}
        </Text>
      </View>
      <Image source={{uri: item.logo}} style={styles.eventLogo} />
      <Text style={styles.eventName}>{item?.name}</Text>
      <Text style={styles.eventType}>{item?.eventType}</Text>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GoKaptureHub - Events</Text>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        ListEmptyComponent={renderEmptyComponent}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
      />
      {/* <TouchableOpacity
        onPress={() => {
          console.log('Add Event');
        }}
        style={{
          backgroundColor: colors.primary,
          width: 80,
          height: 80,
          borderRadius: 50,
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}></TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
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
  },
  eventContainer: {
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    padding: 20,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
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

export default EventListScreen;
