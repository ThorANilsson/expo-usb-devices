// Reexport the native module. On web, it will be resolved to UsbDevicesModule.web.ts
// and on native platforms to UsbDevicesModule.ts
export { default } from './UsbDevicesModule';
export * from './UsbDevices.types';
