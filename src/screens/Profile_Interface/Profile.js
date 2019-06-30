import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImageOverlay from "react-native-image-overlay";

import {photos} from '../../../utils/assets'

const { width } = Dimensions.get('window');


export default class Profile extends Component{
    scrollX = new Animated.Value(0) // this will be the scroll location of our ScrollView

    render(){
        // position will be a value between 0 and photos.length - 1 assuming you don't scroll pass the ends of the ScrollView
        let position = Animated.divide(this.scrollX, width);

        return(
            <View style={styles.containerProfile}>
                
                <TouchableHighlight onPress={() => this.props.navigation.navigate('People')}>
                    <Icon name="arrow-left" color="#202020" size={30}/>
                </TouchableHighlight>

                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 5, backgroundColor: '#fff'}}>
                                <View
                                // this will bound the size of the ScrollView to be a square because
                                // by default, it will expand regardless if it has a flex value or not
                                style={{ width, height: width }}
                                >
                                <ScrollView
                                    horizontal={true}
                                    pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
                                    showsHorizontalScrollIndicator={false}
                                    // the onScroll prop will pass a nativeEvent object to a function
                                    onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
                                    [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
                                    )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
                                    scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
                                    >
                                    {photos.map((source, i) => { // for every object in the photos array...
                                    return ( // ... we will return a square Image with the corresponding object as the source
                                        <ImageOverlay
                                        key={i}
                                        source={source}
                                        style={{width: width - 10, height: width}}
                                        contentPosition='bottom'
                                        overlayColor="cyan"
                                        overlayAlpha={0.2}
                                        >
                                            <View style={{flexDirection: 'row', marginLeft: 50}}>
                                                {/* Display the dots for the profile Images  */}
                                                {photos.map((_, i) => { // the _ just means we won't use that parameter
                                                 let opacity = position.interpolate({
                                                    inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
                                                    outputRange: [0.3, 1, 0.3], // when position is not i, the opacity of the dot will animate to 0.3
                                                    // inputRange: [i - 0.50000000001, i - 0.5, i, i + 0.5, i + 0.50000000001], // only when position is ever so slightly more than +/- 0.5 of a dot's index
                                                    // outputRange: [0.3, 1, 1, 1, 0.3], // is when the opacity changes from 1 to 0.3
                                                    extrapolate: 'clamp' // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
                                                  });

                                                    return (
                                                        <Animated.View // we will animate the opacity of the dots later, so use Animated.View instead of View here
                                                        key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                                                        style={{ opacity, height: 15, width: 15, backgroundColor: '#202020', margin: 8, 
                                                        borderRadius: 10, marginTop: 25}}
                                                        />
                                                    );
                                                    })}

                                                <Button rounded bordered
                                                    style={{width: 50,backgroundColor: 'white',
                                                        height: 50, justifyContent: 'center', borderColor: 'green', marginLeft: 10,
                                                        marginRight: 10}}>
                                                    <Image source={require('../../../assets/images/messages.png')} style={{width: 30, height: 30}}/>
                                                </Button>     
                                            </View>
                                    </ImageOverlay>  
                                    );
                                    })}
                                </ScrollView>

                                 <View style={{flex: 1, justifyContent: 'center', marginTop: 50}}>
                                    <View style={{ flexDirection: 'row', 
                                            marginBottom: 50, marginBottom: 10, marginLeft: 20}}>
                                            <Button rounded bordered
                                                    style={{width: 30,backgroundColor: 'white',
                                                        height: 30, justifyContent: 'center', borderColor: 'green', marginLeft: 10,
                                                        marginRight: 10}}>
                                                    <Image source={require('../../../assets/images/education_1.png')} style={{width: 20, height: 20}}/>
                                                </Button>  
                                            <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 5}}>Universidad de Piura</Text>
                                        </View>
                                        <View style={{flexDirection: 'row',
                                                marginBottom: 10, marginLeft: 20}}>
                                            <Button rounded bordered
                                                    style={{width: 30,backgroundColor: 'white',
                                                        height: 30, justifyContent: 'center', borderColor: 'green', marginLeft: 10,
                                                        marginRight: 10}}>
                                                    <Image source={require('../../../assets/images/location_1.png')} style={{width: 20, height: 20}}/>
                                                </Button>  
                                            <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 5}}>18 km</Text>
                                        </View>    

                                        <View style={{ height: 5, width: width - 10, backgroundColor: '#202020', marginLeft: 10,
                                                        marginRight: 10 
                                                        }}>
                                                                        
                                            <View style={{marginTop: 30}}>
                                                    <Text style={{fontSize: 23, fontWeight: 'bold', marginLeft: 5, }}>Acerca de Daniela</Text>
                                                    <Text style={{marginLeft: 8, fontWeight: 'bold', fontSize: 15, padding: 10}}>Quiero hacer nuevos amigos cerca de ml</Text>      
                                            </View>           
                                            
                                        </View>
                                   </View>  
                                    
                                </View>
                                
                                
                        </View>
            
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerProfile: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 2,
        margin: 10
    },

    
});