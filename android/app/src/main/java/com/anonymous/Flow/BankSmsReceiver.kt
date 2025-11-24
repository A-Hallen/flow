package com.anonymous.Flow

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Telephony
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule

class BankSmsReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION != intent.action) return

    val bundle: Bundle? = intent.extras
    val pdus = bundle?.get("pdus") as? Array<*>
    if (pdus == null || pdus.isEmpty()) return

    val format = bundle.getString("format")
    val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
    for (sms in messages) {
  val address = sms.displayOriginatingAddress ?: ""
  val body = sms.displayMessageBody ?: ""

  // TEMPORAL: no filtres por address, solo loguea y emite
  // if (!address.contains("PAGOxMOVIL", ignoreCase = true)) continue

  val app = context.applicationContext as? ReactApplication ?: continue
  val reactContext = app.reactNativeHost.reactInstanceManager.currentReactContext ?: continue

  val params = Arguments.createMap().apply {
    putString("address", address)
    putString("body", body)
    putDouble("date", sms.timestampMillis.toDouble())
  }

  reactContext
    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    .emit("bankSms", params)
}
  }
}