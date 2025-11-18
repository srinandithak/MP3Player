package com.mp3playerfinal;




import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;




import java.util.*;




public class AudioModulePackage implements ReactPackage {




    //Creates a list of java logic modules for React Native
    //Adds AudioModule.java that controls logic for controlling music
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new AudioModule(reactContext));
        return modules;
    }




    //Creates empty list of java UI components (because Java is not used for UI here)
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }




}
