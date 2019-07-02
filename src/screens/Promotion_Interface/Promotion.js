import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated, Platform} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImageOverlay from "react-native-image-overlay";

import {photos} from '../../../utils/assets'

import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

import Permissions from 'react-native-permissions'
import MapView, {
    ProviderPropType,
    Marker,
    AnimatedRegion,
    PROVIDER_GOOGLE
  } from 'react-native-maps';



  const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const { width } = Dimensions.get('window');

export default class Promotion extends Component{
    constructor(props){
        super(props)

        this.state = {
            coordinate: new AnimatedRegion({
              latitude: LATITUDE,
              longitude: LONGITUDE,
            }),
          };   


        this.actName = this.props.navigation.state.params.activityName
        this.locationData = this.props.navigation.state.params.result
        this.currentUserLatitude = this.props.navigation.state.params.lat
        this.currentUserLongitude = this.props.navigation.state.params.lng
        this.image_api = this.props.navigation.state.params.image_api
        this.API_KEY = 'AIzaSyAizovCeZayRAZthl91it19QYFw1UF3-Jk' 
    }

    animate() {
        const { coordinate } = this.state;
        const newCoordinate = {
          latitude: LATITUDE + (Math.random() - 0.5) * (LATITUDE_DELTA / 2),
          longitude: LONGITUDE + (Math.random() - 0.5) * (LONGITUDE_DELTA / 2),
        };
    
        if (Platform.OS === 'android') {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }
      }

    getInitialState() {
        return {
          region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        };
    }

    componentDidMount(){
       
    }

    render(){
        
        return(
            <ScrollView>
                  <View style={styles.containerProfile}>
                    <View style={styles.chatNavBar}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Activity')}>
                            <Icon name="arrow-left" color="white" size={30}/>
                        </TouchableHighlight>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold', left: 30}}>i
                            <Text style={{color: 'white', fontSize: 20, textDecorationLine: 'underline',
                                fontWeight: 'bold', paddingBottom: 10}}>No te aburras</Text>!
                        </Text>
                    </View>
                    <View style={{padding: 10, marginRight: 5, backgroundColor: '#fff'}}>
                        <TouchableHighlight>
                            <Card>
                                <CardItem cardBody bordered>
                                    {
                                        this.locationData.photos ? (
                                            <Image 
                                            source = {{uri: `${this.image_api}${this.locationData.photos[0].photo_reference}&key=${this.API_KEY}`}}
                                            style={{width: width-50, height: 200}}
                                            />
                                        ) : (
                                            <Image
                                            source={require('../../../assets/images/kfc.jpg')}
                                            style={{width: width-50, height: 150}}
                                        />        
                                        )
                                    }
                                </CardItem>
                                <CardItem bordered>
                                <Body>
                                    <Text>{this.locationData.name}</Text>
                                </Body>
                                </CardItem>
                            </Card>
                        </TouchableHighlight>
                        <Text style={{padding: 10}}>!Selecciona una pelicula e invita a alguien</Text>

                        {/* <View style={{width: 120, height: 150}}>
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
                                    <TouchableHighlight>
                                        <ImageOverlay
                                            key={i}
                                            source={source}
                                            style={{width: 100, height: 100}}
                                            contentPosition='bottom'>

                                            </ImageOverlay>  
                                    </TouchableHighlight>
                                );
                                })}
                            </ScrollView>
                        </View> */}

                    </View>
                    {/* <View>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={{
                            latitude: LATITUDE,
                            longitude: LONGITUDE,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                        />        
                    </View> */}
                    
                </View>  
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    containerProfile: {
        flex: 1,
        backgroundColor: '#202020',
        paddingBottom: 20
    },
   chatNavBar: {
    flexDirection: 'row',
    height: 60,
    marginTop: 10
    }

});