package com.coronotrace.coronavirustracker;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.ArrayAdapter;

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
     * Adapter for working with messages from nearby publishers.
     */
    private ArrayAdapter<String> mNearbyDevicesArrayAdapter;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mMessageListener = new MessageListener() {
            @Override
            public void onFound(Message message) {
                Log.d(TAG, "Found message: " + new String(message.getContent()));
            }

            @Override
            public void onLost(Message message) {
                Log.d(TAG, "Lost sight of message: " + new String(message.getContent()));
            }
        };

        // Build the message that is going to be published
       mMessage = new Message("Hello World".getBytes());
    }

    @Override
    public void onStart() {
        super.onStart();

        Log.d(TAG, "Publishing message");
        Nearby.getMessagesClient(this).publish(mMessage);
        Nearby.getMessagesClient(this).subscribe(mMessageListener);
    }

    @Override
    public void onStop() {
        Nearby.getMessagesClient(this).unpublish(mMessage);
        Nearby.getMessagesClient(this).unsubscribe(mMessageListener);
        super.onStop();
    }

}
