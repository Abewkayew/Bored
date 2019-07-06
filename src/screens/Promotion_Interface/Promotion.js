import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated, Platform} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImageOverlay from "react-native-image-overlay";

import {photos} from '../../../utils/assets'

import { PermissionsAndroid } from 'react-native';

import {getDistanceFromLatLonInKm} from '../../../utils/getDistance';

import Polyline from '@mapbox/polyline'


import Permissions from 'react-native-permissions'
import MapView, {
    ProviderPropType,
    Marker,
    AnimatedRegion,
    PROVIDER_GOOGLE
  } from 'react-native-maps';


const { width } = Dimensions.get('window');

export default class Promotion extends Component{
    constructor(props){
        super(props)

        this.screen = Dimensions.get('window');
        this.ASPECT_RATIO = this.screen.width / this.screen.height;
        this.LATITUDE_DELTA = 0.0922;
        this.LONGITUDE_DELTA = this.LATITUDE_DELTA * this.ASPECT_RATIO;
            
        this.actName = this.props.navigation.state.params.activityName
        this.locationData = this.props.navigation.state.params.result
        this.currentUserLatitude = this.props.navigation.state.params.lat
        this.currentUserLongitude = this.props.navigation.state.params.lng
        this.image_api = this.props.navigation.state.params.image_api
        this.API_KEY = 'AIzaSyAizovCeZayRAZthl91it19QYFw1UF3-Jk'

        this.latitude = this.locationData.geometry.location.lat
        this.longitude = this.locationData.geometry.location.lng

        this.state = {
            coordinate: new AnimatedRegion({
              latitude: this.latitude,
              longitude: this.longitude,
              distance: 0,
              coords: [],
              x: 'false'
            }),
          }; 

        this.locationTest = [
            {latitude: this.latitude, longitude: this.longitude},
            {latitude: this.latitude, longitude: this.longitude}
        ]  
        this.coord = {
            latitude: this.latitude,
            longitude: this.longitude
        }
    }

    animate() {
        const { coordinate } = this.state;
        const newCoordinate = {
          latitude: this.latitude + (Math.random() - 0.5) * (this.LATITUDE_DELTA / 2),
          longitude: this.longitude + (Math.random() - 0.5) * (this.LONGITUDE_DELTA / 2),
        };
    
        if (Platform.OS === 'android') {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }
      }

    getDistance = () => {
        
        const lat1 = this.currentUserLatitude
        const lon1 = this.currentUserLongitude
        const lat2 = this.locationData.geometry.location.lat
        const lon2 = this.locationData.geometry.location.lng
        let distanceInBetween = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
        distanceInBetween = distanceInBetween.toFixed(2)
        this.setState({distance: distanceInBetween})

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

    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=${this.API_KEY}`)
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            })
            this.setState({coords: coords})
            return coords
        } catch(error) {
            alert(error)
            return error
        }
    }

    mergeLot(){
        if (this.latitude != null && this.longitude!=null)
         {
           let concatLot = this.latitude +","+this.longitude
           let concatLot1 = this.currentUserLatitude +","+this.currentUserLongitude

           this.setState({
             concat: concatLot,
             concat1: concatLot1
           }, () => {
             this.getDirections(concatLot, concatLot1);
           });
         }
    
       }


    componentDidMount(){
        this.getDistance()
        this.mergeLot()
    }

    render(){
        
        const markers = [];
        if (this.locationData) {
            for(var i of this.locationTest) {
                markers.push(i);
            }
        }

        return(
            <ScrollView>
                  <View style={styles.containerProfile}>
                    <View style={styles.chatNavBar}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Invitation', {actName: this.actName})}>
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
                                    <Text style={{fontSize: 18}}>{this.locationData.name}</Text>
                                    <View style={{flexDirection: 'row', marginTop: 8}}> 
                                        <Image
                                            source={require('../../../assets/images/pin.png')}
                                            style={{width: 25, height: 25}}
                                            />
                                        {   this.state.distance < 1000 ? (   
                                                <Text style={{fontSize: 18}}>{this.state.distance} m </Text>
                                            ) :
                                            (   
                                                <Text style={{fontSize: 18}}>{(this.state.distance)/1000} km </Text>
                                            )
                                        }
                                    </View>
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



                        <MapView.Animated
                            provider={PROVIDER_GOOGLE}                            
                            zoomEnabled={true}
                            minZoomLevel ={0}
                            showUserLocation
                            followUserLocation
                            pitchEnabled={true}
                            showsCompass={true}
                            showsBuildings={true}
                            showsIndoors={true}
                            style={{width: width-30, padding: 10, marginRight: 5, height: 300}}
                            initialRegion={{
                                latitude: this.latitude,
                                longitude: this.longitude,
                                latitudeDelta: this.LATITUDE_DELTA,
                                longitudeDelta: this.LONGITUDE_DELTA,
                            }}
                         >
                            {!!this.latitude && !!this.longitude && <MapView.Marker
                                    coordinate={{"latitude":this.latitude,"longitude":this.longitude}}
                                    title={this.locationData.name}
                                />
                            }

                            {!!this.currentUserLatitude && !!this.currentUserLongitude && <MapView.Marker
                            coordinate={{"latitude":this.currentUserLatitude,"longitude":this.currentUserLongitude}}
                            title={"Your Position"} image={require('../../../assets/images/icons8-marker-100.png')}
                            />}   

                           {!!this.latitude && !!this.longitude && this.state.x == 'true' && 
                                <MapView.Polyline
                                    coordinates={this.state.coords}
                                    strokeWidth={2}
                                    strokeColor="red"
                                />
                            }
                            <MapView.Polyline
                                coordinates={[
                                    {latitude: this.currentUserLatitude, longitude: this.currentUserLongitude},
                                    {latitude: this.latitude, longitude: this.longitude},
                                ]}
                                strokeWidth={2}
                                strokeColor="black"/>
                            
                        </MapView.Animated>        

                    </View>                    
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
    },
    map: {
        width: 300,
        height: 200
    }
});