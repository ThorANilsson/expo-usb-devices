<p>
  <a href="https://github.com/ThorANilsson/expo-usb-devices">
    <img
      src="resources/expo-usb-devices.svg"
      alt="expo-usb-devices"
      height="64" />
  </a>
</p>

Lists USB input devices that are connected to an Android device. Originally built for a point-of-sale app that needed to know whether the barcode scanner is plugged in properly.

> **Android only.** Usage on iOS or web returns an empty list.
>
> **Not supported in Expo Go.** Requires a [development build](https://docs.expo.dev/develop/development-builds/introduction/).
>
> **Not USB-only.** Bluetooth input devices can appear in the list too.

This is a community module, not affiliated with Expo.

## Installation

```
npx expo install expo-usb-devices
```

Then rebuild the project.

## Usage

```tsx
import { Text } from 'react-native';
import { useUsbDevices } from 'expo-usb-devices';

const SCANNER = { vendorId: 0x0483, productId: 0x0011 };

export default function ScannerStatus() {
  const devices = useUsbDevices();
  const connected = devices.some(
    (device) => device.vendorId === SCANNER.vendorId && device.productId === SCANNER.productId
  );

  return <Text>{connected ? 'Scanner connected' : 'Scanner missing'}</Text>;
}
```

## No permissions required

Neither `InputDevice.getDeviceIds()` nor `UsbManager.getDeviceList()` require permission on Android. Consent is only needed to `openDevice()` which this library never does.

## API

```ts
import UsbDevices, { useUsbDevices } from 'expo-usb-devices';
```

### `useUsbDevices(): UsbDevice[]`

Lists on mount, subscribes to changes and re-lists when app is opened from background.

### `UsbDevices.list(): Promise<UsbDevice[]>`

Reads the list of connected devices once and returns.

### `UsbDevices.addListener('onChange', listener)`

Executes when an input device is added, removed or changed.

```ts
const subscription = UsbDevices.addListener('onChange', ({ devices }) => {
  // ...
});

subscription.remove();
```

### `UsbDevice`

| Field        | Type              | Notes                                                                              |
| ------------ | ----------------- | ---------------------------------------------------------------------------------- |
| `id`         | `number`          | Stable key.                                                                        |
| `name`       | `string`          | Can in some cases be very generic like "USB Adapter Device" for a barcode scanner. |
| `vendorId`   | `number`          | Value embedded into the USB device, such as "0x0483"                               |
| `productId`  | `number`          | Value embedded into the USB device, such as "0x0011"                               |
| `descriptor` | `string`          | Stable key after replug and reboot. Identical units may share one.                 |
| `isEnabled`  | `boolean`         | False when the device is connected but disabled by the system.                     |
| `isKeyboard` | `boolean`         | True for keyboards.                                                                |
| `usb`        | `UsbInfo \| null` | Extra USB details. `null` for barcode scanners and most keyboards.                 |

### `UsbInfo`

| Field              | Type             |
| ------------------ | ---------------- |
| `deviceId`         | `number`         |
| `deviceName`       | `string`         |
| `manufacturerName` | `string \| null` |
| `productName`      | `string \| null` |
| `deviceClass`      | `number`         |
| `interfaces`       | `UsbInterface[]` |

### `UsbInterface`

| Field               | Type     |
| ------------------- | -------- |
| `interfaceClass`    | `number` |
| `interfaceSubclass` | `number` |
| `interfaceProtocol` | `number` |
| `endpointCount`     | `number` |

## License

MIT
