package com.scanner.printermodule

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import net.posprinter.POSConnect
import net.posprinter.IConnectListener
import net.posprinter.IDeviceConnection
import net.posprinter.CPCLPrinter
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL

class PrinterModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var curConnect: IDeviceConnection? = null
    private var cpclPrinter: CPCLPrinter? = null

    init {
        POSConnect.init(reactContext)
    }

    override fun getName(): String {
        return "PrinterModule"
    }

    @ReactMethod
    fun connectBt(macAddress: String, promise: Promise) {
        curConnect = POSConnect.createDevice(POSConnect.DEVICE_TYPE_BLUETOOTH)
        curConnect?.connect(macAddress, object : IConnectListener {
            override fun onStatus(code: Int, connInfo: String, msg: String) {
                if (code == POSConnect.CONNECT_SUCCESS) {
                    cpclPrinter = CPCLPrinter(curConnect)
                    promise.resolve("Connected")
                } else {
                    promise.reject("CONNECT_FAILED", msg)
                }
            }
        })
    }

    @ReactMethod
    fun disconnect(promise: Promise) {
        curConnect?.let {
            it.close()
            curConnect = null
            cpclPrinter = null
            promise.resolve("Disconnected")
        } ?: promise.reject("NOT_CONNECTED", "Printer not connected")
    }

    @ReactMethod
    fun initializePrinter(height: Int, qty: Int, promise: Promise) {
        cpclPrinter?.initializePrinter(0, height, qty)
        promise.resolve("Printer initialized")
            ?: promise.reject("NOT_CONNECTED", "Printer not connected")
    }

    @ReactMethod
    fun addText(x: Int, y: Int, text: String, promise: Promise) {
        cpclPrinter?.addText(x, y, text)
        promise.resolve("Text added")
            ?: promise.reject("NOT_CONNECTED", "Printer not connected")
    }

    @ReactMethod
    fun addSpeed(level: Int, promise: Promise){
        cpclPrinter?.addSpeed(level)
        promise.resolve("Speed Added")
            ?: promise.reject("NOT_CONNECTED", "Printer not connected")
    }

    @ReactMethod
    fun addBeep(seconds: Int, promise: Promise){
        val durationInEighths = (seconds / 0.125).toInt()
        cpclPrinter?.addBeep(durationInEighths)
        promise.resolve("Beep Added") ?: promise.reject("NOT_CONNECTED", "Printer not connected")
    }

    @ReactMethod
    fun addPageWidth(width: Int, promise: Promise){
        cpclPrinter?.addPageWidth(width);
        promise.resolve("Page Width Added")
            ?: promise.reject("NOT_CONNECTED", "Printer not connected")
    }

    @ReactMethod
    fun addImage(imageUrl: String, x: Int, y: Int, promise: Promise) {
        cpclPrinter?.let { printer ->
            Thread {
                try {
                    val url = URL(imageUrl)
                    val connection = url.openConnection() as HttpURLConnection
                    connection.doInput = true
                    connection.connect()
                    val input: InputStream = connection.inputStream
                    val bitmap: Bitmap = BitmapFactory.decodeStream(input)
                    printer.addCGraphics(x, y, bitmap.width, bitmap)
                    promise.resolve("Image added")
                } catch (e: Exception) {
                    promise.reject("IMAGE_ERROR", e.message)
                }
            }.start()
        } ?: promise.reject("NOT_CONNECTED", "Printer not connected")
    }

    @ReactMethod
    fun print(promise: Promise) {
        cpclPrinter?.addPrint()
        promise.resolve("Printed")
            ?: promise.reject("NOT_CONNECTED", "Printer not connected")
    }
}
