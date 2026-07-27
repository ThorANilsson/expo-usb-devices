import { NativeModule, requireNativeModule } from 'expo';

import { UsbDevice, UsbDevicesModuleEvents } from './UsbDevices.types';

declare class UsbDevicesModule extends NativeModule<UsbDevicesModuleEvents> {
  list(): Promise<UsbDevice[]>;
}

export default requireNativeModule<UsbDevicesModule>('UsbDevices');
