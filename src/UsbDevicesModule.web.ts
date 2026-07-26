import { registerWebModule, NativeModule } from 'expo';

import { UsbDevicesModuleEvents } from './UsbDevices.types';

// UsbDevicesModule is not available on the web platform.
class UsbDevicesModule extends NativeModule<UsbDevicesModuleEvents> {}

export default registerWebModule(UsbDevicesModule, 'UsbDevicesModule');
