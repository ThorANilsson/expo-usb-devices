import { registerWebModule, NativeModule } from 'expo';

import { UsbDevice, UsbDevicesModuleEvents } from './UsbDevices.types';

// IOKit is a closed API so the list of devices will always be empty
class UsbDevicesModule extends NativeModule<UsbDevicesModuleEvents> {
  async list(): Promise<UsbDevice[]> {
    return [];
  }
}

export default registerWebModule(UsbDevicesModule, 'UsbDevicesModule');
