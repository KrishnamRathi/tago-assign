import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import styles from '../assets/styles'
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Cart = () => {

    const [cart, setCart] = useState();

    const renderBook = ({ item }) => (
        <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Image source={{ uri: item.volumeInfo.imageLinks.smallThumbnail }} style={{ height: 150, width: 90 }} />
            <View>
                <Text style={{ maxWidth: 200 }}>{item.volumeInfo.title}</Text>
                <TouchableOpacity style={{ marginTop: 10 }} onPress={() => deleteFromCart(item)} >
                    <AntDesign size={26} name="delete" />
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '900', alignSelf: 'center' }}>Rs. {item.volumeInfo.pageCount || 69}</Text>

        </TouchableOpacity>
    )

    const deleteFromCart = async (item) => {
        try {
            var cartItems = await AsyncStorage.getItem('cart');
            if (!cartItems) cartItems = [];
            else cartItems = JSON.parse(cartItems);
            cartItems = cartItems.filter((book) => book.id !== item.id);
            setCart(cartItems);
            console.log(cartItems.length);
            await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
        } catch (e) {
            console.warn("Error while deleting item from cart", e);
        }
    }

    useEffect(async () => {
        var cartItems = await AsyncStorage.getItem('cart');
        if (!cartItems) cartItems = [];
        else cartItems = JSON.parse(cartItems);
        setCart(cartItems);
    }, [cart])

    const getTotalPrice = () => {
        var price = 0;
        cart?.map(book => price += book.volumeInfo.pageCount || 69);
        return price;
    }

    const buyNow = async () => {
        try {
            var user = await AsyncStorage.getItem('token');
            user = JSON.parse(user);
            var obj = {};
            obj['name'] = user.user.name.split(' ')[0].toLowerCase();
            obj['total'] = getTotalPrice();
            var books = [];
            cart.map(b => books.push({ "id": b.id, "title": b.volumeInfo.title }));
            obj['books'] = books;
            // console.log(obj);
            fetch('https://api.tago.care/assignment/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(obj)
            })
                .then(response => response.json())
                .then(data => {
                    alert('Successfully Bought!')
                    console.log(data);
                })
                .catch(e => alert('Error while buying!'));

        } catch (e) {
            alert(e);
        }
    }

    return (
        <View style={[styles.container, { marginBottom: 60 }]}>
            <Text style={[styles.headingSmall, { marginBottom: 15 }]}>Shopping Cart</Text>
            <View>
                {!cart || cart.length === 0 ? <Text>No items in cart</Text> :
                    (
                        <View style={{ height: '100%' }}>
                            <Text style={{ fontSize: 20, fontWeight: '900', textAlign: 'right', marginBottom: 10 }}>Amount</Text>
                            <FlatList
                                data={cart}
                                keyExtractor={(book) => book.id}
                                renderItem={renderBook}
                            />
                            <View style={{ backgroundColor: 'lightgray', padding: 10, borderRadius: 10, marginBottom: 50 }}>
                                <Text>No. of Books: {cart?.length || 0}</Text>
                                <Text>Total Price: {getTotalPrice()}</Text>
                                <TouchableOpacity style={[styles.button, { marginVertical: 10, backgroundColor: 'black' }]} onPress={buyNow}>
                                    <Text style={{ textAlign: 'center', color: 'white' }}>Buy Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }


            </View>
        </View>
    )
}

export default Cart
