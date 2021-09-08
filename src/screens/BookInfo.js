import React from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import styles from '../assets/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookInfo = ({ route }) => {

    const book = route.params;

    const addToCart = async (item) => {
        try {
            var cartItems = await AsyncStorage.getItem('cart');
            cartItems = cartItems !== null ? JSON.parse(cartItems) : [];
            if(cartItems.filter((book) => book.id === item.id).length === 0) cartItems.push(item);
            console.log(cartItems.length);
            cartItems = JSON.stringify(cartItems);
            await AsyncStorage.setItem('cart', cartItems);
        } catch (e) {
            console.warn('Error while adding to cart', e);
        }
    }

    return (
        <ScrollView style={[styles.container, {display: 'flex', flexDirection: 'column', height: '100%'}]}>
            <View style={{alignItems: 'center', marginBottom: 10}}>
                <Image source={{ uri: book.volumeInfo.imageLinks.thumbnail }} style={{ height: 400, width: 250, borderRadius: 10, marginBottom: 10}} />
                <Text style={{fontWeight: 'bold', fontSize: 20}}>{book.volumeInfo.title}</Text>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Rs. {book.volumeInfo.pageCount}</Text>
                <Text style={{alignSelf: 'flex-start', fontWeight: 'bold'}}>Description: </Text>
                <Text>{book.volumeInfo.description}</Text>
            </View>
            <TouchableOpacity style={[styles.button, {marginBottom: 30, backgroundColor: 'black'}]} onPress={() => addToCart(book)}>
                <Text style={{textAlign: 'center', color: 'white'}}>Add to cart</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default BookInfo
