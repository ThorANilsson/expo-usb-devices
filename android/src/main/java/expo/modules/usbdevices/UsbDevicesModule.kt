package expo.modules.usbdevices

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class UsbDevicesModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("UsbDevices")

    Events("onChange")

    Function("hello") {
      "Hello world! 👋"
    }
  }
}
