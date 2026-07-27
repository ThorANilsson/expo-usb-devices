import { UsbDevice, useUsbDevices } from 'expo-usb-devices';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <DeviceList />
    </SafeAreaProvider>
  );
}

function DeviceList() {
  const devices = useUsbDevices();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Connected devices ({devices.length})</Text>
        {devices.map((device) => (
          <Device key={device.id} device={device} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Device({ device }: { device: UsbDevice }) {
  return (
    <View style={styles.device}>
      <Text style={styles.name}>{device.name}</Text>
      <Text style={styles.detail}>vendorId: {hex(device.vendorId)}</Text>
      <Text style={styles.detail}>productId: {hex(device.productId)}</Text>
      <Text style={styles.detail}>keyboard: {String(device.isKeyboard)}</Text>
      <Text style={styles.detail}>enabled: {String(device.isEnabled)}</Text>
      {device.usb ? (
        <Text style={styles.detail}>
          {`usb ${device.usb.manufacturerName ?? '?'} ${device.usb.productName ?? '?'}`}
        </Text>
      ) : null}

      <Text style={styles.mono}>{device.descriptor}</Text>
    </View>
  );
}

const hex = (id: number) => id.toString(16).padStart(4, '0');

const styles = {
  container: { flex: 1, backgroundColor: '#eee' },
  header: { fontSize: 30, margin: 20 },
  device: { margin: 20, marginTop: 0, backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  name: { fontSize: 18, marginBottom: 4 },
  detail: { fontSize: 13, color: '#555' },
  mono: { fontFamily: 'monospace', fontSize: 10, marginTop: 8, color: '#999' },
};
