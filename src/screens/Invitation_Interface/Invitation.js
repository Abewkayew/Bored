import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImageOverlay from "react-native-image-overlay";
const { width } = Dimensions.get('window');

export default class Invitation extends Component{
    
    render(){
        // position will e a value between 0 and photos.length - 1 assuming you don't scroll pass the ends of the ScrollView
        let position = Animated.divide(this.scrollX, width);
        const actName = this.props.navigation.state.params.activityName 

        return(
            <View style={styles.containerPeople}>
                    <View style={styles.peopleNavBar}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Activity')}>
                            <Icon name="arrow-left" color="white" size={30}/>
                        </TouchableHighlight>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold', right: 30}}>i
                            <Text style={{color: 'white', fontSize: 20, textDecorationLine: 'underline',
                               fontWeight: 'bold', paddingBottom: 10}}>No te aburras</Text>!
                        </Text>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('ChatContainer')}>
                            <Icon name="message-text" style={{fontSize: 30, color: 'white'}}/>
                        </TouchableHighlight>
                    </View>
                    <ScrollView>
                        <View style={styles.tabViewStyle}>
                            <TouchableHighlight>
                                <Button onPress={() => this.props.navigation.navigate('People',  {activityName: actName})} 
                                        bordered light style={{width: 150, justifyContent: 'center'}}>
                                    <Text style={{color: 'white'}}>personas</Text>
                                </Button>
                            </TouchableHighlight>

                           <TouchableHighlight>
                                <Button onPress={() => this.props.navigation.navigate('Invitation', {activityName: actName})}
                                        bordered light style={{width: 150, justifyContent: 'center'}}>
                                    <Text style={{color: 'white'}}>invitaciones</Text>
                                </Button>
                           </TouchableHighlight>

                        </View>

                        {/* Just for checking the Image Horizontal Scroller...*/}

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#fff'}}>
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
                                        <TouchableHighlight onPress={this.props.navigation.navigate('People')}>
                                            <ImageOverlay
                                            source={require('../../../assets/images/location_invite/1.jpg')}
                                            style={{width, height: width}}
                                            overlay='cyan'
                                            contentPosition='bottom'>
                                                    
                                            </ImageOverlay>    
                                        </TouchableHighlight>
                                        
                                </ScrollView>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                                            <Text style={{fontSize: 16, fontWeight:'bold'}}>Cineplanet esta` a 30m</Text>
                                            
                                        </View>
                                </View>
                                
                        </View>


                        {/* End of the Image Scroll Example */}




                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#fff'}}>
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
                                    
                                        <ImageOverlay
                                        source={require('../../../assets/images/location_invite/2.jpg')}
                                        style={{width, height: width}}
                                        overlay='cyan'
                                        contentPosition='bottom'>
                                            
                                    </ImageOverlay>  
                                </ScrollView>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                                            <Text style={{fontSize: 16, fontWeight:'bold'}}>Cineplanet esta` a 30m</Text>
                                            
                                        </View>
                                </View>
                                
                        </View>


                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#fff'}}>
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
                                       <ImageOverlay
                                        source={require('../../../assets/images/location_invite/3.jpg')}
                                        style={{width, height: width}}
                                        overlay='cyan'
                                        contentPosition='bottom'>
                                            
                                    </ImageOverlay>  
                                </ScrollView>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                                            <Text style={{fontSize: 16, fontWeight:'bold'}}>Cineplanet esta` a 30m</Text>
                                            
                                        </View>
                                </View>
                                
                        </View>            

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#fff'}}>
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
                                        <ImageOverlay
                                        source={require('../../../assets/images/location_invite/4.jpg')}
                                        style={{width, height: width}}
                                        overlay='cyan'
                                        contentPosition='bottom'>
                                            
                                    </ImageOverlay>  
                                  
                                </ScrollView>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                                            <Text style={{fontSize: 16, fontWeight:'bold'}}>Cineplanet esta` a 30m</Text>
                                            
                                        </View>
                                </View>
                                
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#fff'}}>
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
                                        <ImageOverlay
                                        source={require('../../../assets/images/location_invite/5.jpg')}
                                        style={{width, height: width}}
                                        overlay='cyan'
                                        contentPosition='bottom'>
                                            
                                    </ImageOverlay>  
                               </ScrollView>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                                            <Text style={{fontSize: 16, fontWeight:'bold'}}>Cineplanet esta` a 30m</Text>
                                            
                                        </View>
                                </View>
                                
                        </View>
                    </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerPeople: {
        flex: 1,
        backgroundColor: '#202020',
        padding: 10
    },
    peopleNavBar: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 60
    },
    tabViewStyle: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'space-between'
    },
    peopleImageStyle: {
        backgroundColor: 'white',
        marginTop: 20
    },
    backgroundContainer:{
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      overlay: {
        opacity: 0.5,
        backgroundColor: '#000000'
      },
      logo: {
        backgroundColor: 'rgba(0,0,0,0)',
        width: 160,
        height: 52
      },
      backdrop: {
        flex:1,
        flexDirection: 'column'
      },
      headline: {
        fontSize: 18,
        textAlign: 'center',
        backgroundColor: 'black',
        color: 'white'
      }
});