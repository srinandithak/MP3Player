import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {NativeModules } from 'react-native';
import MusicIcon from './assets/music.svg';
import UploadIcon from './assets/upload.svg';
import PauseIcon from './assets/pause.svg';
import PlayIcon from './assets/play.svg';
import Slider from '@react-native-community/slider';

const {AudioModule} = NativeModules;

export default function PlayerScreen({route, navigation}) {

    //Gets file path
    const [fileUri, setUri] = useState(null);
    //Tracks if player is playing
    const[playing, setIsPlaying] = useState(false);
    //Position song is palying at
    const[position, setPosition] = useState(0);
    //Duration of song
    const[duration, setDuration] = useState(1);

    useEffect(() => {
        if(route.params?.fileUri) {
            setUri(route.params.fileUri);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            const pos = await AudioModule.getPosition();
            const dur = await AudioModule.getDuration();
            setPosition(pos);
            setDuration(dur);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(fileUri) {
            play();
        }
    }, [fileUri]);

    const pickFile = async () => {
        try {
            const uri = await AudioModule.pickFile();


            if(uri) {
                setUri(uri);
            }

        } catch (e) {
            console.warn(e);
        }
    };

    const play = async () => {
        console.log("FILE URI RECEIVED:", fileUri);

        await AudioModule.play(fileUri);
        setIsPlaying(true);
    };

    const pause = async () => {
        if(playing) {
            try {
                await AudioModule.pause();
                setIsPlaying(false);
            } catch (error) {
                console.log("Error pausing audio", error);
            }
        } else {
            AudioModule.play(fileUri);
            setIsPlaying(true);
        }
    };

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms/1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2,'0')}`;
    }

    return (
        <View style={styles.container}>

        <View style={styles.mainCircle}>
            <MusicIcon width={320} height={320} />
        </View>

        <Slider
            style={{width: 350, height: 10}}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            minimumTrackTintColor="#f062c0"
            maximumTrackTintColor="#FFB6C1"
            thumbTintColor="#f062c0"
            onSlidingComplete={(value) => {
                AudioModule.seekTo(Math.floor(value));
            }}
        />

        <View style={styles.row}>
            <Text style={styles.time}>{formatTime(position)}</Text>
            <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.row}>
        <TouchableOpacity style={styles.smallCircle} onPress={pickFile}>
                <UploadIcon width={20} height={20} fill="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallCircle} onPress={pause}>
            {playing ? (
                <PauseIcon width={20} height={20} fill="#f062c0" />
            ) : (
                <PlayIcon width={20} height={20} fill="#f062c0" />
            )}
        </TouchableOpacity>

        </View>


        <View style={styles.bottomBar} />
        </View>

);
}

const PINK = "#f062c0";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 100,
    },

    time: {

        color: PINK,
    },

    mainCircle: {
        marginTop: 30,
        marginBottom: 50,
        width: 370,
        height: 370,
        borderRadius: 80,
        backgroundColor: PINK,
        justifyContent: "center",
        alignItems: "center",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginBottom: 10,
    },

    smallCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: PINK,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
  },

   bottomBar: {
        position: "absolute",
        bottom: 0,
        height: 170,
        width: "100%",
        backgroundColor: PINK,
    },
});


