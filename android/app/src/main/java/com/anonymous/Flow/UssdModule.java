package com.hallen.Flow;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class UssdModule extends ReactContextBaseJavaModule {
  public UssdModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return "UssdModule";
  }

  @ReactMethod
  public void callUssd(String code, Promise promise) {
    Activity activity = getCurrentActivity();
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "No current activity");
      return;
    }

    try {
      Intent intent = new Intent(Intent.ACTION_CALL);
      intent.setData(Uri.parse("tel:" + Uri.encode(code)));
      activity.startActivity(intent);
      promise.resolve(null);
    } catch (Exception e) {
      promise.reject("CALL_ERROR", e);
    }
  }
}