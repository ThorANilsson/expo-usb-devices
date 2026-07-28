package expo.modules.usbdevices

import android.content.Context
import android.hardware.input.InputManager
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbManager
import android.os.Handler
import android.os.Looper
import android.view.InputDevice
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

private val PLACEHOLDER_VENDOR_IDS = setOf(0x0000, 0x0001)

class UsbDevicesModule : Module() {
  private val context: Context?
    get() = try {
      appContext.reactContext
    } catch (destroyed: IllegalArgumentException) {
      null
    }

  private val handler = Handler(Looper.getMainLooper())

  @Volatile
  private var observedInputManager: InputManager? = null

  private val deviceListener = object : InputManager.InputDeviceListener {
    override fun onInputDeviceAdded(deviceId: Int) = emitChange()
    override fun onInputDeviceRemoved(deviceId: Int) = emitChange()
    override fun onInputDeviceChanged(deviceId: Int) = emitChange()
  }

  private fun emitChange() {
    sendEvent("onChange", mapOf("devices" to peripherals()))
  }

  private fun startObserving() {
    val manager = context?.getSystemService(Context.INPUT_SERVICE) as? InputManager ?: return
    manager.registerInputDeviceListener(deviceListener, handler)
    observedInputManager = manager
  }

  private fun stopObserving() {
    observedInputManager?.unregisterInputDeviceListener(deviceListener)
    observedInputManager = null
  }

  override fun definition() = ModuleDefinition {
    Name("UsbDevices")

    Events("onChange")

    AsyncFunction("list") {
      peripherals()
    }

    OnStartObserving {
      startObserving()
    }

    OnStopObserving {
      stopObserving()
    }

    OnDestroy {
      stopObserving()
    }
  }

  private fun peripherals(): List<Map<String, Any?>> {
    val usbDevices = usbDevicesByModel()

    return InputDevice.getDeviceIds()
      .toList()
      .mapNotNull { InputDevice.getDevice(it) }
      .filter { !it.isVirtual && it.vendorId !in PLACEHOLDER_VENDOR_IDS }
      .map { device ->
        mapOf(
          "id" to device.id,
          "name" to device.name,
          "vendorId" to device.vendorId,
          "productId" to device.productId,
          "descriptor" to device.descriptor,
          "isEnabled" to device.isEnabled,
          "isKeyboard" to (device.keyboardType == InputDevice.KEYBOARD_TYPE_ALPHABETIC),
          "usb" to usbDevices[device.vendorId to device.productId]?.let(::usbDetail)
        )
      }
  }

  private fun usbDevicesByModel(): Map<Pair<Int, Int>, UsbDevice> {
    val usbManager = context?.getSystemService(Context.USB_SERVICE) as? UsbManager
      ?: return emptyMap()

    return usbManager.deviceList.values.associateBy { it.vendorId to it.productId }
  }

  private fun usbDetail(device: UsbDevice): Map<String, Any?> =
    mapOf(
      "deviceId" to device.deviceId,
      "deviceName" to device.deviceName,
      "manufacturerName" to device.manufacturerName,
      "productName" to device.productName,
      "deviceClass" to device.deviceClass,
      "interfaces" to usbInterfaces(device)
    )

  private fun usbInterfaces(device: UsbDevice): List<Map<String, Any?>> =
    (0 until device.interfaceCount).map { index ->
      val usbInterface = device.getInterface(index)
      mapOf(
        "interfaceClass" to usbInterface.interfaceClass,
        "interfaceSubclass" to usbInterface.interfaceSubclass,
        "interfaceProtocol" to usbInterface.interfaceProtocol,
        "endpointCount" to usbInterface.endpointCount
      )
    }
}
