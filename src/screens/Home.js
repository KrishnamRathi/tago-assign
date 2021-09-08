import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import styles from '../assets/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';


// const books = [
//     {
//         kind: "books#volume",
//         id: "eq9XvgAACAAJ",
//         etag: "iY9PwoFMv2M",
//         selfLink: "https://www.googleapis.com/books/v1/volumes/eq9XvgAACAAJ",
//         volumeInfo: {
//             title: "Fantastic Beasts and Where to Find Them: Cinematic Guide: Newt Scamander Do Not Feed Out",
//             authors: [
//                 "Felicity Baker"
//             ],
//             publishedDate: "2017-02-02",
//             description: "The essential film companion for Newt Scamander! Relive the magic of Newt's world with this hardback guidebook featuring your favourite scenes and quotes from Fantastic Beasts and Where to Find Them.",
//             industryIdentifiers: [
//                 {
//                     type: "ISBN_10",
//                     identifier: "1407179403"
//                 },
//                 {
//                     type: "ISBN_13",
//                     identifier: "9781407179407"
//                 }
//             ],
//             readingModes: {
//                 text: false,
//                 image: false
//             },
//             pageCount: 64,
//             printType: "BOOK",
//             averageRating: 5,
//             ratingsCount: 1,
//             maturityRating: "NOT_MATURE",
//             allowAnonLogging: false,
//             contentVersion: "preview-1.0.0",
//             panelizationSummary: {
//                 containsEpubBubbles: false,
//                 containsImageBubbles: false
//             },
//             imageLinks: {
//                 smallThumbnail: "http://books.google.com/books/content?id=eq9XvgAACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
//                 thumbnail: "http://books.google.com/books/content?id=eq9XvgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
//             },
//             language: "en",
//             previewLink: "http://books.google.co.in/books?id=eq9XvgAACAAJ&dq=harry+potter&hl=&cd=1&source=gbs_api",
//             infoLink: "http://books.google.co.in/books?id=eq9XvgAACAAJ&dq=harry+potter&hl=&source=gbs_api",
//             canonicalVolumeLink: "https://books.google.com/books/about/Fantastic_Beasts_and_Where_to_Find_Them.html?hl=&id=eq9XvgAACAAJ"
//         },
//         saleInfo: {
//             country: "IN",
//             saleability: "NOT_FOR_SALE",
//             isEbook: false
//         },
//         accessInfo: {
//             country: "IN",
//             viewability: "NO_PAGES",
//             embeddable: false,
//             publicDomain: false,
//             textToSpeechPermission: "ALLOWED",
//             epub: {
//                 isAvailable: false
//             },
//             pdf: {
//                 isAvailable: false
//             },
//             webReaderLink: "http://play.google.com/books/reader?id=eq9XvgAACAAJ&hl=&printsec=frontcover&source=gbs_api",
//             accessViewStatus: "NONE",
//             quoteSharingAllowed: false
//         },
//         searchInfo: {
//             textSnippet: "Relive all the magic of Newt&#39;s world with this hardback guidebook featuring all you need to know about Newt from the movie."
//         }
//     }
// ]

const Home = ({ navigation }) => {
    const [user, setUser] = useState();
    const [books, setBooks] = useState([]);

    const getBooks = async () => {
        await fetch('https://www.googleapis.com/books/v1/volumes?q=harry+potter&maxResults=20')
            .then(res => res.json())
            .then(data => setBooks(data.items))
            .catch(err => alert('Unable to fetch books', err));
    }

    useEffect(async () => {
        await getBooks();
        try {
            var token = await AsyncStorage.getItem('token');
            token = token !== null ? JSON.parse(token) : null;
            if (token) setUser(token);
        }catch(e){
            alert('Error while validating user');
        }

    }, [])

    const addToCart = async (item) => {
        try {
            var cartItems = await AsyncStorage.getItem('cart');
            cartItems = cartItems !== null ? JSON.parse(cartItems) : [];
            if (cartItems.filter((book) => book.id === item.id).length === 0) cartItems.push(item);
            cartItems = JSON.stringify(cartItems);
            await AsyncStorage.setItem('cart', cartItems);
        } catch (e) {
            console.warn('Error while adding to cart', e);
        }
    }

    const renderBook = ({ item }) => (
        <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }} onPress={() => navigation.navigate('BookInfo', item)} >
            <Image source={{ uri: item.volumeInfo.imageLinks.smallThumbnail }} style={{ height: 150, width: 90 }} />
            <View>
                <Text style={{ maxWidth: 200 }}>{item.volumeInfo.title}</Text>
                <Text>Rs. {item.volumeInfo.pageCount || 69}</Text>
            </View>
            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => addToCart(item)} >
                <Image source={require('../assets/icons/add.png')} style={{ height: 30, width: 30 }} />
            </TouchableOpacity>
        </TouchableOpacity>
    )

    if (books.length === 0) return <Text>No books</Text>;

    return (
        <View style={[styles.container, { marginBottom: 60 }]}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }} >Hi, {user?.user.name}</Text>
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 10 }} >List</Text>
            <FlatList
                data={books}
                keyExtractor={(book) => book.id}
                renderItem={renderBook}
            />
        </View>
    )
}

export default Home
