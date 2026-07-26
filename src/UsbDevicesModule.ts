import { NativeModule, requireNativeModule } from 'expo';

import { UsbDevicesModuleEvents } from './UsbDevices.types';

declare class UsbDevicesModule extends NativeModule<UsbDevicesModuleEvents> {
  hello(): string;
}

export default requireNativeModule<UsbDevicesModule>('UsbDevices');
