import {
  View,
  Text,
  Switch,
  Platform,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, fonts} from '../constants';
import BleManager, {Peripheral} from 'react-native-ble-manager';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {showToast} from '../helper/toast';
import {
  addBeep,
  addImage,
  addPageWidth,
  addText,
  connectBt,
  disconnect,
  initializePrinter,
  print,
} from '../lib';
import Button from '../components/Button';

const ConnectPrinterScreen = () => {
  const [bluetoothTurnOn, setBluetoothTurnOn] = useState(false);
  const [devices, setDevices] = useState<Peripheral[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Peripheral | null>(
    null,
  );
  const [connectionDone, setConnectionDone] = useState(false);
  const [isTestingThermalPrinter, setIsTestingThermalPrinter] = useState(false);

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
                showToast('error', 'Permissions not granted');
              }
            } catch (error) {
              showToast('error', 'Error enabling Bluetooth');
            }
          },
        },
      ],
    );
  };

  const checkBluetoothState = () => {
    const stateListener = BleManager.addListener(
      'BleManagerDidUpdateState',
      async ({state}) => {
        console.log('Bluetooth state:', state);
        if (state === 'on') {
          setBluetoothTurnOn(true);
          const permissionsGranted = await checkPermissions();
          if (permissionsGranted) {
            startScan();
          } else {
            showToast('error', 'Permissions not granted');
          }
        } else {
          setBluetoothTurnOn(false);
          requestEnableBluetooth();
        }
      },
    );

    BleManager.checkState();

    return () => {
      stateListener.remove();
    };
  };

  const checkAlreadyConnectedDevice = async () => {
    try {
      const connectedDevices = await BleManager.getConnectedPeripherals([]);
      if (connectedDevices.length > 0) {
        connectBt(connectedDevices[0].id)
          .then(() => {
            showToast('success', 'Connected to ' + connectedDevices[0].name);
            setConnectionDone(true);
            setConnectedDevice(connectedDevices[0]);
          })
          .catch(e => {
            showToast('error', 'Error connecting to device: ' + e);
          });
      }
    } catch (error) {
      console.log('Error checking connected devices:', error);
    }
  };

  useEffect(() => {
    BleManager.start({showAlert: true})
      .then(() => {
        console.log('BleManager started...');
        checkAlreadyConnectedDevice();
        checkBluetoothState();
      })
      .catch(error =>
        showToast('error', 'Error starting BleManager: ' + error),
      );
      return () => {
        if (connectedDevice) {
          disconnect().then(() => {
            BleManager.stopScan();
            BleManager.removeAllListeners('BleManagerDiscoverPeripheral');
            BleManager.removeBond(connectedDevice.id);
          })
        }
      }
  }, []);

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
        return true;
      }
    } catch (error) {
      showToast('error', 'Error checking permissions: ' + error);
      return false;
    }
  };

  const switchOnAndOffBluetooth = async (value: boolean) => {
    try {
      if (value) {
        await BleManager.enableBluetooth();
        const permissionsGranted = await checkPermissions();
        setBluetoothTurnOn(value);
        if (permissionsGranted) {
          startScan();
        } else {
          showToast('error', 'Permissions not granted, requesting...');
          requestPermissionsLoop();
        }
      } else {
        showToast(
          'info',
          "You can turn off Bluetooth from your phone's settings",
        );
        setDevices([]);
      }
    } catch (error) {
      console.log('Error switching Bluetooth:', error);
    }
  };

  const requestPermissionsLoop = async () => {
    let retryCount = 0;
    const maxRetries = 5;
    while (retryCount < maxRetries) {
      const permissionsGranted = await checkPermissions();
      if (permissionsGranted) {
        startScan();
        break;
      }
      retryCount++;
      await requestPermissions();
    }
    if (retryCount >= maxRetries) {
      showToast('error', 'Unable to get permissions after multiple attempts');
    }
  };

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
        await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
      }
    } catch (error) {
      showToast('error', 'Error requesting permissions: ' + error);
    }
  };

  const startScan = async () => {
    try {
      setDevices([]);
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

  const refreshDevices = () => {
    if (bluetoothTurnOn) {
      startScan();
    } else {
      showToast('info', 'Please turn on Bluetooth first');
    }
  };

  const connectDevice = async (item: Peripheral) => {
    if (connectedDevice) {
      setConnectedDevice(null);
      BleManager.disconnect(connectedDevice.id).then(() => {
        showToast('info', 'Disconnected from ' + connectedDevice.name);
      });
    } else {
      if (!item.name?.startsWith('HGS')) {
        showToast('error', 'We only support HGRT printers');
        return;
      }
      setIsConnecting(true);
      BleManager.connect(item.id)
        .then(async () => {
          showToast('success', 'Connected to ' + item.name);
          setConnectedDevice(item);
          connectBt(item.id)
            .then(() => {
              setConnectionDone(true);
              setIsConnecting(false);
            })
            .catch(error => Alert.alert('Error connecting to device:', error));
        })
        .catch(error => {
          showToast('error', 'Error connecting to device: ' + error);
          Alert.alert('Error connecting to device:', error);
        });
    }
  };

  return (
    <View
      style={{
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#F3F2F7',
        padding: 20,
      }}>
      <Text
        style={{
          fontSize: 18,
          color: colors.textColor,
          fontFamily: fonts.GilroySemibold,
          marginBottom: 20,
        }}>
        Connect to Bluetooth Printer
      </Text>
      <View
        style={{
          width: '100%',
          height: 50,
          backgroundColor: '#fff',
          flexDirection: 'row',
          borderRadius: 10,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: fonts.GilroyMedium,
            color: colors.textColor,
          }}>
          Bluetooth
        </Text>
        <Switch
          disabled={isConnecting || isTestingThermalPrinter}
          onValueChange={switchOnAndOffBluetooth}
          trackColor={{false: '#F3F2F7', true: '#32C85A'}}
          thumbColor={'#f4f3f4'}
          value={bluetoothTurnOn}
        />
      </View>
      <Text
        style={{
          fontSize: 14,
          fontFamily: fonts.GilroyMedium,
          color: '#79787E',
          marginTop: 10,
        }}>
        Your Phone will be connected to the printer via Bluetooth, and will be
        discoverable to other devices.
      </Text>
      {connectedDevice && connectionDone && (
        <React.Fragment>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.GilroyExtrabold,
              color: '#79787E',
              marginVertical: 10,
            }}>
            CONNECTED PRINTER DEVICE
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: '100%',
              height: 50,
              backgroundColor: '#fff',
              flexDirection: 'row',
              borderRadius: 10,
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.GilroySemibold,
                color: colors.textColor,
              }}>
              {connectedDevice.name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.GilroyMedium,
                color: colors.textColor,
                opacity: 0.8,
              }}>
              {connectedDevice.id}
            </Text>
          </TouchableOpacity>
          <Button
            loading={isTestingThermalPrinter}
            text="Test Thermal Printer"
            onPress={() => {
              setIsTestingThermalPrinter(true);
              initializePrinter(720, 1);
              addPageWidth(720);
              addText(30, 300, 'Hello From GoKaptureHub Event Scanner App');
              addImage(
                'https://gkh-images.s3.amazonaws.com/1eac8266-20c7-425e-bc60-97e72be48fe6_logo.jpg',
                100,
                10,
              )
                .then(() => {
                  print()
                    .then(() => setIsTestingThermalPrinter(false))
                    .catch(e => {
                      setIsTestingThermalPrinter(false);
                      showToast('error', 'Error printing: ' + e);
                    });
                })
                .catch(() => setIsTestingThermalPrinter(false));
            }}
          />
        </React.Fragment>
      )}
      <View style={{width: '100%'}}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.GilroyMedium,
            color: '#79787E',
            marginTop: 30,
          }}>
          AVAILABLE DEVICES - {devices.length}
        </Text>
        <FlatList
          data={devices}
          style={{marginTop: 10, height: '100%'}}
          onRefresh={refreshDevices}
          refreshing={false}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              disabled={
                connectedDevice !== null && connectedDevice.id !== item.id
              }
              onPress={() => connectDevice(item)}
              activeOpacity={0.8}
              style={{
                width: '100%',
                height: 50,
                backgroundColor: item.name ? '#fff' : '#15151a',
                borderWidth: connectedDevice?.id === item.id ? 2 : 0,
                borderColor: '#32C85A',
                flexDirection: 'row',
                borderRadius: 10,
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.GilroySemibold,
                  color: item.name ? colors.textColor : colors.darkTextColor,
                }}>
                {(item.name || item.id).slice(0, 20)}
              </Text>
              {isConnecting && connectedDevice?.id === item.id && (
                <ActivityIndicator size="small" color={colors.textColor} />
              )}
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.GilroyMedium,
                  color: item.name ? colors.textColor : colors.darkTextColor,
                  opacity: 0.8,
                }}>
                {connectedDevice?.id === item.id
                  ? 'Connected'
                  : 'NOT CONNECTED'}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default ConnectPrinterScreen;
