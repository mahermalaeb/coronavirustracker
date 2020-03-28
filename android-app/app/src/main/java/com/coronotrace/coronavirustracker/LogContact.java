package com.coronotrace.coronavirustracker;

import android.app.IntentService;
import android.content.Intent;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.messages.Message;
import com.google.android.gms.nearby.messages.MessageListener;
import com.google.android.gms.nearby.messages.PublishOptions;

public class LogContact extends IntentService {
    public LogContact() {
        super("LogContact");
    }

    /**
     * The {@link Message} object used to broadcast information about the device to nearby devices.
     */
    private Message message;

    /**
     * A {@link MessageListener} for processing messages from nearby devices.
     */
    private MessageListener messageListener;

    private String TAG = "LogContact";

    @Override
    protected void onHandleIntent(Intent intent) {
        // Get the UUID
        SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences("preferences", MODE_PRIVATE);
        String trackingId = sharedPreferences.getString("trackingId", null);
        Log.d(TAG, "Logging contact with Tracking ID: " + trackingId);

        // Setup the message listener
        messageListener = new MessageListener() {
            @Override
            public void onFound(Message message) {
                Log.d(TAG, "Found message: " + new String(message.getContent()));
            }

            @Override
            public void onLost(Message message) {
                Log.d(TAG, "Lost sight of message: " + new String(message.getContent()));
            }
        };

        // Setup the message (just the UUID)
        message = new Message(trackingId.getBytes());

        // Start logging
        startLogging();
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "Broadcasting UUID 2...");
//        startLogging();
    }


    public void startLogging()  {
        Log.d(TAG, "Broadcasting UUID...");

        Nearby.getMessagesClient(this).publish(message);
        Nearby.getMessagesClient(this).subscribe(messageListener);

    }

    public void stopLogging() {
        Nearby.getMessagesClient(this).unpublish(message);
        Nearby.getMessagesClient(this).unsubscribe(messageListener);
    }
}
