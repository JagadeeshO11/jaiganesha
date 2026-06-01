package com.torchcamreal;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class TorchCamModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public TorchCamModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "TorchCamModule";
    }

    @ReactMethod
    public void startService() {
        Intent intent = new Intent(reactContext, TorchCamService.class);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            reactContext.startForegroundService(intent);
        } else {
            reactContext.startService(intent);
        }
    }

    @ReactMethod
    public void stopService() {
        Intent intent = new Intent(reactContext, TorchCamService.class);
        reactContext.stopService(intent);
    }

    @ReactMethod
    public void isBatteryOptimizationEnabled(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String packageName = reactContext.getPackageName();
            PowerManager pm = (PowerManager) reactContext.getSystemService(Context.POWER_SERVICE);
            promise.resolve(!pm.isIgnoringBatteryOptimizations(packageName));
        } else {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void openBatterySettings() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
        }
    }
}
