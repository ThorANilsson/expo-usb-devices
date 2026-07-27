import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { UsbDevice } from './UsbDevices.types';
import UsbDevicesModule from './UsbDevicesModule';

export function useUsbDevices(): UsbDevice[] {
  const [devices, setDevices] = useState<UsbDevice[]>([]);

  useEffect(() => {
    let mounted = true;

    const reread = () => {
      UsbDevicesModule.list().then((current) => {
        if (mounted) {
          setDevices(current);
        }
      });
    };

    reread();

    const subscription = UsbDevicesModule.addListener('onChange', (event) => {
      setDevices(event.devices);
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
