import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import BleManager, {Peripheral} from 'react-native-ble-manager';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {addBeep, addImage, addText, connectBt, initializePrinter, print} from './lib';

const App = () => {
  const [devices, setDevices] = useState<Peripheral[]>([]);
  const [started, setStarted] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Peripheral | null>(
    null,
  );
  const [connectionDone, setConnectionDone] = useState(false);

  useEffect(() => {
    if (!started) {
      BleManager.start({showAlert: true})
        .then(() => {
          setStarted(true);
          checkBluetoothState();
        })
        .catch(error => console.log('Error starting BleManager:', error));
    }
  }, [started]);

  const checkBluetoothState = async () => {
    try {
      BleManager.checkState();
      const stateListener = BleManager.addListener(
        'BleManagerDidUpdateState',
        async ({state}) => {
          if (state === 'on') {
            stateListener.remove();
            const permissionsGranted = await checkPermissions();
            if (permissionsGranted) {
              startScan();
            } else {
              Alert.alert('Permissions not granted');
            }
          } else {
            requestEnableBluetooth();
          }
        },
      );
    } catch (error) {
      console.log('Error checking Bluetooth state:', error);
    }
  };

  const checkPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const bluetoothScanPermission = await check(
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        );
        const bluetoothConnectPermission = await check(
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        );

        if (
          bluetoothScanPermission !== RESULTS.GRANTED ||
          bluetoothConnectPermission !== RESULTS.GRANTED
        ) {
          await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
          await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
          await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        }

        return (
          bluetoothScanPermission === RESULTS.GRANTED &&
          bluetoothConnectPermission === RESULTS.GRANTED
        );
      } else {
        // Handle iOS permissions if necessary
        return true;
      }
    } catch (error) {
      console.log('Error checking permissions:', error);
      return false;
    }
  };

  const requestEnableBluetooth = () => {
    Alert.alert(
      'Bluetooth is off',
      'Please turn on Bluetooth to scan for devices',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await BleManager.enableBluetooth();
              const permissionsGranted = await checkPermissions();
              if (permissionsGranted) {
                startScan();
              } else {
                Alert.alert('Permissions not granted');
              }
            } catch (error) {
              console.log('Error enabling Bluetooth:', error);
            }
          },
        },
      ],
    );
  };

  const startScan = async () => {
    try {
      BleManager.scan([], 15, false)
        .then(() => {
          console.log('Scanning started...');
        })
        .catch(error => console.log('Error starting scan:', error));

      BleManager.addListener(
        'BleManagerDiscoverPeripheral',
        (device: Peripheral) => {
          if (device.name?.startsWith('HGS')) {
            console.log('Discovered device:', device);
          }
          setDevices(prevDevices => {
            if (!prevDevices.some(d => d.id === device.id)) {
              return [...prevDevices, device];
            }
            return prevDevices;
          });
        },
      );
    } catch (error) {
      console.log('Error during scan:', error);
    }
  };

  const connectDevice = async (item: Peripheral) => {
    if (connectedDevice) {
      setConnectedDevice(null);
      BleManager.disconnect(connectedDevice.id).then(() => {
        Alert.alert('Disconnected from device:', connectedDevice.name);
      });
    } else {
      BleManager.connect(item.id)
        .then(async () => {
          setConnectedDevice(item);
          connectBt(item.id).then(() => {
            setConnectionDone(true);
          }).catch(error => Alert.alert('Error connecting to device:', error));
        })
        .catch(error => Alert.alert('Error connecting to device:', error));
    }
  };

  return (
    <View>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              return connectDevice(item);
            }}
            disabled={
              connectedDevice !== null && connectedDevice.id !== item.id
            }
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: 'lightgrey',
              backgroundColor:
                connectedDevice?.id === item.id ? 'lightblue' : 'white',
            }}>
            <Text style={{fontSize: 16, color: '#000'}}>
              {item.name || item.id}
            </Text>
          </TouchableOpacity>
        )}
      />
      {connectedDevice && connectionDone ? (
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: 'lightblue',
            alignItems: 'center',
            marginTop: 10,
            marginHorizontal: 10,
            borderRadius: 10,
          }}
          onPress={async () => {
            // addText(40, 40, 'Hello Siddhant How Are you?');
            // initializePrinter(480, 1);
            // addImage(
            //   'https://gkh-images.s3.amazonaws.com/3c755d5a-01f5-4291-b632-30bdd46f24cc_sample-qr.jpeg',
            //   0,
            //   0,
            // ).then(() => {
            //   print();
            // });
            addBeep(100);
            // print();
          }}>
          <Text style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}>
            {`Print Image in ${connectedDevice.name} Printer`}
          </Text>
        </TouchableOpacity>
      ) : connectedDevice ? (
        <View
          style={{
            width: '100%',
            height: 1000,
          }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : null}
    </View>
  );
};

export default App;
