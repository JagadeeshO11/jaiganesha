package com.torchcamreal;

import android.app.KeyguardManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraManager;
import android.os.Build;
import android.os.IBinder;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.util.Log;
import androidx.core.app.NotificationCompat;

public class TorchCamService extends Service implements SensorEventListener {
    private static final String TAG = "TorchCamService";
    private static final String CHANNEL_ID = "TorchCamChannel";
    private static final int NOTIFICATION_ID = 1;
    public static final String ACTION_STOP_SERVICE = "STOP_SERVICE";

    private SensorManager sensorManager;
    private Sensor accelerometer;
    private CameraManager cameraManager;
    private String cameraId;
    private boolean isTorchOn = false;

    private long lastUpdate = 0;
    private float last_x, last_y, last_z;
    private static final int SHAKE_THRESHOLD = 800;
    
    private int shakeCount = 0;
    private long lastShakeTime = 0;
    private static final long SHAKE_WINDOW = 1500;
    private static final long COOLDOWN_TIME = 2000;
    private long lastActionTime = 0;

    @Override
    public void onCreate() {
        super.onCreate();
        try {
            sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
            accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
            cameraManager = (CameraManager) getSystemService(Context.CAMERA_SERVICE);
            String[] ids = cameraManager.getCameraIdList();
            if (ids.length > 0) {
                cameraId = ids[0];
            }
            createNotificationChannel();
        } catch (Exception e) {
            Log.e(TAG, "Failed to initialize service: " + e.getMessage());
            stopSelf();
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_STOP_SERVICE.equals(intent.getAction())) {
            stopForeground(true);
            stopSelf();
            updateServiceState(false);
            return START_NOT_STICKY;
        }

        startForeground(NOTIFICATION_ID, getNotification());
        if (accelerometer != null) {
            sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_NORMAL);
        }
        updateServiceState(true);
        return START_STICKY;
    }

    private void updateServiceState(boolean enabled) {
        SharedPreferences prefs = getSharedPreferences("TorchCamPrefs", MODE_PRIVATE);
        prefs.edit().putBoolean("service_enabled", enabled).apply();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (sensorManager != null) {
            sensorManager.unregisterListener(this);
        }
        if (isTorchOn) toggleTorch(false);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        try {
            long curTime = System.currentTimeMillis();
            if ((curTime - lastUpdate) > 100) {
                long diffTime = (curTime - lastUpdate);
                lastUpdate = curTime;

                float x = event.values[0];
                float y = event.values[1];
                float z = event.values[2];

                float speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

                if (speed > SHAKE_THRESHOLD) {
                    handleShake(curTime);
                }

                last_x = x;
                last_y = y;
                last_z = z;
            }
        } catch (Exception e) {
            Log.e(TAG, "Sensor error: " + e.getMessage());
            stopSelf();
        }
    }

    private void handleShake(long curTime) {
        if (curTime - lastActionTime < COOLDOWN_TIME) return;

        if (curTime - lastShakeTime > SHAKE_WINDOW) {
            shakeCount = 1;
        } else {
            shakeCount++;
        }
        lastShakeTime = curTime;

        if (shakeCount == 2) {
            new android.os.Handler().postDelayed(() -> {
                if (shakeCount == 2) {
                    toggleTorch(!isTorchOn);
                    shakeCount = 0;
                    lastActionTime = System.currentTimeMillis();
                }
            }, 500);
        } else if (shakeCount == 3) {
            launchCamera();
            shakeCount = 0;
            lastActionTime = curTime;
        }
    }

    private void toggleTorch(boolean on) {
        if (cameraId == null) return;
        try {
            cameraManager.setTorchMode(cameraId, on);
            isTorchOn = on;
            vibrate();
        } catch (CameraAccessException e) {
            Log.e(TAG, "Torch access error: " + e.getMessage());
        }
    }

    private void launchCamera() {
        KeyguardManager km = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
        if (km != null && km.isKeyguardLocked()) {
            showUnlockNotification();
            return;
        }

        try {
            Intent intent = new Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            vibrate();
        } catch (Exception e) {
            Log.e(TAG, "Camera launch error: " + e.getMessage());
        }
    }

    private void showUnlockNotification() {
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        Notification unlockNotification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Unlock to open Camera")
                .setContentText("The device is locked. Please unlock to use the camera.")
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .build();
        manager.notify(2, unlockNotification);
    }

    private void vibrate() {
        Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        if (v != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                v.vibrate(VibrationEffect.createOneShot(100, VibrationEffect.DEFAULT_AMPLITUDE));
            } else {
                v.vibrate(100);
            }
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "TorchCam Background Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }
    }

    private Notification getNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this,
                0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);

        Intent stopIntent = new Intent(this, TorchCamService.class);
        stopIntent.setAction(ACTION_STOP_SERVICE);
        PendingIntent stopPendingIntent = PendingIntent.getService(this,
                0, stopIntent, PendingIntent.FLAG_IMMUTABLE);

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("TorchCam Active")
                .setContentText("Double shake for Torch, Triple for Camera")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentIntent(pendingIntent)
                .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Stop Service", stopPendingIntent)
                .setOngoing(true)
                .build();
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}

    @Override
    public IBinder onBind(Intent intent) { return null; }
}
