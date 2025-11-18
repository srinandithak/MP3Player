//Imports react and the components needed
import * as React from 'react';
//Manages navigation system
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import PlayerScreen from './PlayerScreen';

//Creates stack object with navigator and screens
const Stack = createNativeStackNavigator();

export default function App() {

    return (

        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                headerShown: false
                }}
            >

            {/*First screen in stack*/}
            <Stack.Screen
                name="Home"
                component={HomeScreen}
            />

            {/*Second screen*/}
            <Stack.Screen
                name="Player"
                component={PlayerScreen}
            />

            </Stack.Navigator>
        </NavigationContainer>
    );
}


