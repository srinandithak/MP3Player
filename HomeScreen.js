import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {NativeModules } from 'react-native';
import UploadIcon from './assets/upload.svg';
//Access AudioModule module
const {AudioModule} = NativeModules;

export default function HomeScreen({navigation}) {



    //Prompts user to pick file when upload button is clicked
    const pickFile = async () => {
        try {
            const uri = await AudioModule.pickFile();

            if(uri) {
                //Navigates to player screen
                navigation.navigate("Player", {fileUri: uri });

            }
        } catch (e) {
            console.warn(e);
        }
    };


    return (
        <View style={styles.container}>

        {/* Title text*/}
        <View style={styles.titleText}>
            <Text style={styles.title}>MP3</Text>
            <Text style={styles.title}>Player</Text>
        </View>
        {/* Create upload icon/button*/}
        <TouchableOpacity style={styles.uploadCircle} onPress={pickFile}>
            <UploadIcon width={120} height={200} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickButton} onPress={pickFile}>
            <Text style={styles.pickButtonText}>Pick a File</Text>
        </TouchableOpacity>

        <View style={styles.bottomBar} />
        </View>
    );
}

const PINK = "#f062c0";

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#fff",
        justifyContent: "center",   //Centers vertically
        alignItems: "center",       //Center horizontally
    },

    titleText: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },

    title: {
     color: PINK,
     fontSize: 100,
     fontWeight: "bold",
     marginVertical: -5,
    },

    uploadCircle: {
        marginTop: 30,
        width: 160,
        height: 160,
        borderRadius: 80,      //Makes circle
        backgroundColor: PINK,
        justifyContent: "center",
        alignItems: "center",
    },

    uploadIcon: {
        fontSize: 60,
        color: "white",
    },

    pickButton: {
        marginTop: 40,
        backgroundColor: PINK,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
        marginBottom: 100,
    },

    pickButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },

    bottomBar: {
        position: "absolute",
        bottom: 0,
        height: 170,
        width: "100%",
        backgroundColor: PINK,
    },
});

