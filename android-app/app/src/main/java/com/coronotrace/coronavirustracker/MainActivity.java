package com.coronotrace.coronavirustracker;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Switch;

import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.messages.Message;
import com.google.android.gms.nearby.messages.MessageListener;
import com.google.android.gms.nearby.messages.MessagesOptions;
import com.google.android.gms.nearby.messages.PublishOptions;
import com.google.android.gms.nearby.messages.Strategy;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "Message";

    /**
     * The {@link Message} object used to broadcast information about the device to nearby devices.
     */
    private Message mMessage;

    /**
     * A {@link MessageListener} for processing messages from nearby devices.
     */
    private MessageListener mMessageListener;

    /**
     * App setting
     */
    private SharedPreferences sharedPreferences;
    private Boolean trackingEnabled;
    private String symptomsReportedDate;
    private Boolean symptomsRecentlyReported;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        /**
         * Set trackingEnabled switch based on current settings
         */
        sharedPreferences = getApplicationContext().getSharedPreferences("preferences", MODE_PRIVATE);
        int trackingEnabledInt = sharedPreferences.getInt("trackingEnabled", 1);
        trackingEnabled = trackingEnabledInt == 1;
        symptomsReportedDate = sharedPreferences.getString( "symptomsReportedDate",  null);

        // Set tracking enabled switch
        Switch trackingEnabledSwitch = (Switch) findViewById(R.id.trackingEnabled);
        trackingEnabledSwitch.setChecked(trackingEnabled);

        // If symptoms were reported over 14 days ago, ignore them
        if (symptomsReportedDate != null) {
            Long symptomsReportedSystemTime = Long.parseLong(symptomsReportedDate);
            Long currentSystemTime = System.currentTimeMillis();
            int fourteenDaysInMillis = 1209600000;
            if (symptomsReportedSystemTime + fourteenDaysInMillis > currentSystemTime) {
                symptomsRecentlyReported = true;
            }
        }

//        mMessageListener = new MessageListener() {
//            @Override
//            public void onFound(Message message) {
//                Log.d(TAG, "Found message: " + new String(message.getContent()));
//            }
//
//            @Override
//            public void onLost(Message message) {
//                Log.d(TAG, "Lost sight of message: " + new String(message.getContent()));
//            }
//        };
//
//        // Build the message that is going to be published
//       mMessage = new Message("Hello World".getBytes());
    }

    /**
     * Handle trackingEnabled switch change
     */
    public void setTrackingEnabled(View view) {
        trackingEnabled = !trackingEnabled;
        int trackingEnabledInt = trackingEnabled ? 1 : 0;
        sharedPreferences.edit().putInt("trackingEnabled", trackingEnabledInt);
    }


    /**
     * On start/stop
     */
//    @Override
//    public void onStart() {
//        super.onStart();
//
//        Log.d(TAG, "Publishing message");
//        Nearby.getMessagesClient(this).publish(mMessage);
//        Nearby.getMessagesClient(this).subscribe(mMessageListener);
//    }
//
//    @Override
//    public void onStop() {
//        Nearby.getMessagesClient(this).unpublish(mMessage);
//        Nearby.getMessagesClient(this).unsubscribe(mMessageListener);
//        super.onStop();
//    }

    /**
     * Symptom checker button
     */
    public void checkSymptoms(View view) {
        // Do something
        Intent intent = new Intent(this, CheckSymptoms.class);
        startActivity(intent);
    }
}
