import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { UsbDevice } from './UsbDevices.types';
import UsbDevicesModule from './UsbDevicesModule';

export function useUsbDevices(): UsbDevice[] {
  const [devices, setDevices] = useState<UsbDevice[]>([]);

  useEffect(() => {
    let mounted = true;

    let issued = 0;
    let newestApplied = 0;

    const applyIfNewest = (reading: number, current: UsbDevice[]) => {
      if (!mounted || reading < newestApplied) {
        return;
      }
      newestApplied = reading;
      setDevices(current);
    };

    const reread = () => {
      const reading = ++issued;
      UsbDevicesModule.list().then((current) => applyIfNewest(reading, current));
    };

    reread();

    const subscription = UsbDevicesModule.addListener('onChange', (event) => {
      applyIfNewest(++issued, event.devices);
    });

    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        reread();
      }
    });

    return () => {
      mounted = false;
      subscription.remove();
      appState.remove();
    };
  }, []);

  return devices;
}
