export type UsbInterface = {
  interfaceClass: number;
  interfaceSubclass: number;
  interfaceProtocol: number;
  endpointCount: number;
};

export type UsbInfo = {
  deviceId: number;
  deviceName: string;
  manufacturerName: string | null;
  productName: string | null;
  deviceClass: number;
  interfaces: UsbInterface[];
};

export type UsbDevice = {
  id: number;
  name: string;
  vendorId: number;
  productId: number;
  descriptor: string;
  isEnabled: boolean;
  isKeyboard: boolean;
  usb: UsbInfo | null;
};

export type ChangeEvent = {
  devices: UsbDevice[];
};

export type UsbDevicesModuleEvents = {
  onChange: (event: ChangeEvent) => void;
};
