import React, { useState, useEffect } from 'react'
import { Button } from 'react-native'
import Auth from './screens/Auth';
import Home from './screens/Home';
import Cart from './screens/Cart';
import BookInfo from './screens/BookInfo';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs({ logout }) {
    return (
        <Tab.Navigator initialRouteName="Home" activeColor="#f0edf6" inactiveColor="#3e2465">
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="home" color={color} size={26} />
                    ),
                    headerRight: () => (
                        <Button
                            onPress={logout}
                            title="Logout"
                        />
                    )
                }}
            />
            <Tab.Screen
                name="Cart"
                component={Cart}
                options={{
                    tabBarLabel: 'Cart',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="shopping-cart" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const AppFlow = ({ logout }) => (
    <Stack.Navigator>
        <Stack.Screen name="BottomTabs" options={{ headerShown: false }} >
            {props => <BottomTabs logout={logout} />}
        </Stack.Screen>
        <Stack.Screen name="BookInfo" component={BookInfo} />
    </Stack.Navigator>
)

const LoginFlow = ({ setFlow }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Auth" options={{ headerShown: false }}>
                {props => <Auth setFlow={setFlow} />}
            </Stack.Screen>
        </Stack.Navigator>
    )
}

const index = () => {
    const [flow, setFlow] = useState(0);

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('cart');
        setFlow(0);
    }

    useEffect(async () => {
        try {
            var token = await AsyncStorage.getItem('token');
            token = token !== null ? JSON.parse(token) : null;
            if (token) setFlow(1);
        }catch(e){
            console.warn(e);
        }
    }, [])

    if (flow === 0) return <LoginFlow setFlow={setFlow} />
    else
        return (
            <AppFlow logout={logout} />
        )
}

export default index
