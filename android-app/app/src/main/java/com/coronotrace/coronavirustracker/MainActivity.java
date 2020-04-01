package com.coronotrace.coronavirustracker;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Switch;
import android.widget.TextView;


import com.amazonaws.mobile.client.AWSMobileClient;
import com.amazonaws.mobile.client.Callback;
import com.amazonaws.mobile.client.UserStateDetails;
import com.amplifyframework.AmplifyException;
import com.amplifyframework.api.aws.AWSApiPlugin;
import com.amplifyframework.api.graphql.MutationType;
import com.amplifyframework.core.Amplify;
import com.amplifyframework.datastore.generated.model.Contact;
import com.amplifyframework.datastore.generated.model.Todo;
import com.coronotrace.auth.AnonymousAuth;


import java.util.UUID;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "Message";

    /**
     * App setting
     */
    private SharedPreferences sharedPreferences;
    private Boolean trackingEnabled;
    private String symptomsReportedDate;
    private Boolean symptomsRecentlyReported = false;
    private String trackingId;
    private Intent trackingEnabledIntent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        /**
         * Initialise AWS Amplify
         */
        try {
            Amplify.addPlugin(new AWSApiPlugin());
            Amplify.configure(getApplicationContext());
        } catch (AmplifyException exception) {
            Log.e("Amplify", "Failed to initialize Amplify", exception);
        }

        AnonymousAuth auth = new AnonymousAuth(this);
        trackingId = auth.initialise();
        Log.i("Amplify", "Identity:  " + trackingId);

        /**
         * Get/update trackingEnabled setting and trackingId sharedPreferences
         */
        sharedPreferences = getApplicationContext().getSharedPreferences("preferences", MODE_PRIVATE);
        int trackingEnabledInt = sharedPreferences.getInt("trackingEnabled", 1);
        trackingEnabled = trackingEnabledInt == 1;

        // Update the tracking ID
        sharedPreferences.edit().putString("trackingId", trackingId).apply();

        // Set tracking enabled switch
        Switch trackingEnabledSwitch = (Switch) findViewById(R.id.trackingEnabled);
        trackingEnabledSwitch.setChecked(trackingEnabled);

        // Start the foreground service if tracking is enabled
        trackingEnabledIntent = new Intent(this, LogContact.class);
        if (trackingEnabled) {
            startService(trackingEnabledIntent);
        }

    }

    /**
     * Handle trackingEnabled switch change
     */
    public void setTrackingEnabled(View view) {
        trackingEnabled = !trackingEnabled;

        // Save the variable
        int trackingEnabledInt = trackingEnabled ? 1 : 0;
        sharedPreferences.edit().putInt("trackingEnabled", trackingEnabledInt).apply();

        // Enable/disable tracking
        if (trackingEnabled) {
            startService(trackingEnabledIntent);
        } else {
            stopService(trackingEnabledIntent);
        }
    }


    /**
     * On start/stop
     */
    @Override
    public void onStart() {
        super.onStart();


        /**
         * Update the user status card
         */
        symptomsReportedDate = sharedPreferences.getString( "symptomsReportedDate",  null);

        // If symptoms were reported over 14 days ago, ignore them
        if (symptomsReportedDate != null) {
            Long symptomsReportedSystemTime = Long.parseLong(symptomsReportedDate);
            Long currentSystemTime = System.currentTimeMillis();
            int fourteenDaysInMillis = 1209600000;
            if (symptomsReportedSystemTime + fourteenDaysInMillis > currentSystemTime) {
                symptomsRecentlyReported = true;
            }
        }

        // Get the items to update
        ConstraintLayout statusCard = findViewById(R.id.statusCard);
        TextView statusCardTitle = findViewById(R.id.statusCardTitle);
        TextView statusCardBody = findViewById(R.id.statusCardBody);
        Button mainButton = findViewById(R.id.mainButton);

        // Update the UI if contact/symptoms
        if (symptomsRecentlyReported) {
            // Update the status card
            int backgroundColor = getResources().getColor(R.color.design_default_color_error);
            int textColor = getResources().getColor(R.color.design_default_color_on_primary);
            statusCard.setBackgroundColor(backgroundColor);
            statusCardTitle.setText(R.string.status_symptoms_title);
            statusCardTitle.setTextColor(textColor);
            statusCardBody.setText(R.string.status_symptoms_body);
            statusCardBody.setTextColor(textColor);
            mainButton.setText(R.string.made_mistake);
            mainButton.setBackgroundColor(backgroundColor);
        }
    }

    /**
     * Symptom checker button
     */
    public void checkSymptoms(View view) {

        if (symptomsRecentlyReported == true) {
            sharedPreferences.edit().remove("symptomsReportedDate").apply();

            // Reload activity to get new settings
            finish();
            startActivity(getIntent());

            // TODO - Delete from API
        } else {
            Intent intent = new Intent(this, CheckSymptoms.class);
            startActivity(intent);
        }
    }
}
