import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import styles from '../assets/styles';
import Google from '../assets/icons/google.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';

const Auth = ({ setFlow }) => {
    const googleSignIn = async () => {
        try {
            GoogleSignin.configure({
                webClientId: '118726604007-fi55pibd1rj8r5l6dlae3dvf6972bols',
            });
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('Successfully Loggedin')
            await AsyncStorage.setItem('token', JSON.stringify(userInfo));
            setFlow(1);
        } catch (error) {
            alert(error);
        }
    };

    const login = async () => {
        
    }

    return (
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Text style={[styles.heading, { marginBottom: 10 }]} >Welcome</Text>
            <TouchableOpacity style={[styles.button, { display: 'flex', flexDirection: 'row', alignItems: 'center' }]} onPress={googleSignIn}>
                <Image source={Google} style={{ height: 30, width: 30, marginRight: 10 }} />
                <Text>Login With Google</Text>
            </TouchableOpacity>
        </View>
    )
}



export default Auth
