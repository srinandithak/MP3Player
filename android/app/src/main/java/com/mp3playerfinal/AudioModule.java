package com.mp3playerfinal;




import android.media.MediaPlayer;
import android.net.Uri;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;


import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import android.Manifest; //Access to system permissions constants
import android.content.pm.PackageManager; //Constants for permission results
import androidx.core.content.ContextCompat; //To check for permissions
import androidx.core.app.ActivityCompat; //To request permissions
import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import androidx.annotation.NonNull;


public class AudioModule extends ReactContextBaseJavaModule {

    private static MediaPlayer mediaPlayer;

    //Stores referance to React Native's context so java module
    //can communicate with React framework
    private final ReactApplicationContext reactContext;
    private Promise filePickerPromise;
    private static final int FILE_PICKER_REQUEST = 101;
    public AudioModule(ReactApplicationContext reactContext) {
        //Calls parent constrcutor to allow React Native to
        // register module
        super(reactContext);
        //Stores react context
        this.reactContext = reactContext;

        //Allows us to do filePicker code, ask permissions
        reactContext.addActivityEventListener(listener);
    }



    @NonNull
    @Override
    public String getName() {
        return "AudioModule";
    }


    //Initiates file picking process
    @ReactMethod
    public void pickFile(Promise promise) {
        if(mediaPlayer != null) {
            mediaPlayer.release();
            mediaPlayer = null;
        }

        //Gets current activity
        Activity currentActivity = getCurrentActivity();
        if(currentActivity == null){
            promise.reject("E_ACTIVITY_NULL", "Activity doesn't exist");
            return;
        }
        filePickerPromise = promise;

        try{
            //Allows us to open Android's file picker UI
            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);

            intent.setType("audio/*");
            intent.putExtra(Intent.EXTRA_MIME_TYPES,
                    new String[]{"audio/mpeg", "audio/mp3", "audio/*"});

            //Launches file picker
            currentActivity.startActivityForResult(intent, FILE_PICKER_REQUEST);

        } catch (Exception e){
            filePickerPromise.reject("E_PICKER", e.getMessage());
            filePickerPromise = null;
        }
    }

    //Handles permission request and file picker
    private final ActivityEventListener listener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent){
            //Ensures correct callback and we have promise
            if(requestCode == FILE_PICKER_REQUEST && filePickerPromise != null){
                //Ensures user chose file
                if(resultCode == Activity.RESULT_OK && intent != null){
                    //Points to chosen file
                    Uri uri = intent.getData();
                    if(uri != null) {
                       //Permissions
                        activity.getContentResolver()
                                .takePersistableUriPermission(uri,
                                        Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        filePickerPromise.resolve(uri.toString());
                    } else {
                        filePickerPromise.reject("E_NO_URI", "No file selected");
                    }
                } else {
                    filePickerPromise.resolve(null);
                }
                filePickerPromise = null;
            }
        }
    };



    //Gets position that the song is at
    @ReactMethod
    public void getPosition(Promise promise) {
        if (mediaPlayer != null) {
            promise.resolve(mediaPlayer.getCurrentPosition());
        } else {
            promise.resolve(0);
        }
    }

    //Gets total duration of song
    @ReactMethod
    public void getDuration(Promise promise) {
        if(mediaPlayer != null) {
            promise.resolve(mediaPlayer.getDuration());
        } else {
            promise.resolve(0);
        }
    }

    //Changes where the time the audio is playing from
    @ReactMethod
    public void seekTo(int ms, Promise promise) {
        if(mediaPlayer != null) {
            mediaPlayer.seekTo(ms);
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }

    //Pauses audio if playing
    @ReactMethod
    public void pause(Promise promise) {
        try {
            if (mediaPlayer != null && mediaPlayer.isPlaying()) {
                mediaPlayer.pause();
                promise.resolve("Audio Paused");
            } else {
                promise.resolve("No audio is playing");
            }
        } catch (Exception e) {
            promise.reject("Error pausing audio", e);
        }
    }

    //Plays audio from given filePath
    @ReactMethod
    public void play(String filePath, Promise promise) {

        Activity currentActivity = getCurrentActivity();
        if(currentActivity == null){
            promise.reject("E_ACTIVITY_NULL", "Activity doesn't exist");
            return;
        }

        try {
            if (mediaPlayer != null && !mediaPlayer.isPlaying() && mediaPlayer.getCurrentPosition() > 0) {
               mediaPlayer.start();
               promise.resolve("Audio resumed");
               return;
            } else if (mediaPlayer != null) {
                mediaPlayer.release();
                mediaPlayer = null;
            }
            Uri uri = Uri.parse(filePath);

            mediaPlayer = new MediaPlayer();
            mediaPlayer.setDataSource(currentActivity.getApplicationContext(), uri);
            mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener(){
                @Override
                public void onPrepared(MediaPlayer mp) {
                    mp.start();
                    promise.resolve("Audio is playing");
                }
            });
            mediaPlayer.prepareAsync();

            promise.resolve("Audio started playing");
        } catch (Exception e) {
            promise.reject("Error playing audio", e.getMessage());
        }
    }

}


