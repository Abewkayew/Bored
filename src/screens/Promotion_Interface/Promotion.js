import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated, Platform} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons'

import ImageOverlay from "react-native-image-overlay";

import {photos} from '../../../utils/assets'

import { PermissionsAndroid } from 'react-native';

import {getDistanceFromLatLonInKm} from '../../../utils/getDistance';

import Polyline from '@mapbox/polyline'
import MapViewDirections from 'react-native-maps-directions';
import Firebase from '../../../utils/Config';

import MapView, {
    ProviderPropType,
    Marker,
    AnimatedRegion,
    PROVIDER_GOOGLE
  } from 'react-native-maps'

import Category from './Category'
import SecondCategory from './SecondCategory'

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
        this.currentUserLatitude = this.locationData.userLatitude
        this.currentUserLongitude = this.locationData.userLongitude
        this.image_api = this.props.navigation.state.params.image_api
        this.promotions = this.locationData.promotion

        this.API_KEY = 'AIzaSyAizovCeZayRAZthl91it19QYFw1UF3-Jk'

        this.latitude = this.locationData.latitude
        this.longitude = this.locationData.longitude
        
        this.state = {
            coordinate: new AnimatedRegion({
              latitude: this.latitude,
              longitude: this.longitude,
              distance: 0,
              coords: [],
              x: 'false',
              customPhotoUrl: ''
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

        this.mapView = null;
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
        
        const lat1 = this.locationData.userLatitude
        const lon1 = this.locationData.userLongitude
        const lat2 = this.locationData.latitude
        const lon2 = this.locationData.longitude
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
            // let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=${this.API_KEY}`)
            // let respJson = await resp.json();
            // let points = Polyline.decode(respJson.routes[0].overview_polyline.points);

            let coords = {
                    latitude : this.locationData.latitude,
                    longitude : this.locationData.longitude
            }

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
        const that = this

    }

    render(){
        
        const {customPhotoUrl} = this.state

        return(
            <ScrollView>
                  <View style={styles.containerProfile}>
                  <View style={styles.navigationBar} elevation={20}>
                        <TouchableHighlight style={styles.navigationItems} 
                            onPress={() => this.props.navigation.navigate('Activity')}>
                            <Icon name="arrow-back" size={30}/>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.navigationItems} onPress={() => this.props.navigation.navigate('Activity')}>
                            <Icon name="mood" style={{fontSize: 40, color: '#4DDFE5'}}/>
                        </TouchableHighlight>
                        <View style={styles.navigationItems}>
                            <TouchableHighlight onPress={() => this.props.navigation.navigate('ChatContainer')}>
                                <Image 
                                    source={require('../../../assets/images/message_single_two.png')}
                                    style={{width: 40, height: 40}}
                                />
                            </TouchableHighlight>
                            <Button  
                                rounded style={{top: -15, left: 15, backgroundColor: '#4DDFE5',
                                padding: 5, width: 20, height: 20, alignContent: 'center'}}>
                                <Text style={{color: 'white'}}>2</Text>
                            </Button>
                        </View>
                    </View>
                    <View style={styles.shadowStyle}></View>

                    <View style={styles.containerPlaces}>
                        <View style={styles.imageContainer}>
                            <Image
                                source = {{uri: this.locationData.image}}
                                style={{width: width, height: 250, resizeMode:'cover'}}
                            />
                        </View>
                        <View style={styles.nameAndKm}>
                            <Text style={{marginTop: 5, fontSize: 18, fontWeight: 'bold'}}>{this.locationData.name}</Text>
                            {/* <Text>Photo References: {result.photos.photo_reference}</Text> */}
                            { this.state.distance < 1000 ? (   
                                    this.state.distance == 0 ? (
                                        <Text style={{fontSize: 16, padding: 5}}>{this.state.distance} m away</Text>
                                    ): (
                                        <Text style={{fontSize: 16, padding: 5}}>You are in the same place</Text>
                                    )
                                ) :
                                (   
                                    <Text style={{fontSize: 16, padding: 5}}>{(this.state.distance)/1000} km away</Text>
                                )
                            }
                        </View>
                    </View>

                        <Text style={styles.inviteMovies}>Choose a movie and send an Invitation</Text>
                        
                        <View style={styles.styleHorizontalScrollView}>
                        {/* begin */}
                            <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20, marginBottom: 10}}>

                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}>
                                        
                                        {
                                            this.promotions.map((data, index) => {
                                                return(
                                                <Category imageUri={{uri: data.image }} text={data.text}
                                                />                                                         
                                                )
                                            })
                                        }

                                    </ScrollView>
                                        
                            </View>          
                        {/* end */}
                    </View>
            
                      

                      <View style={styles.mapContainer}>
                        <View style={{backgroundColor: '#3c85fa', height: 50, alignItems: 'center', padding: 5}}>
                           <Text style={{color: 'white'}}>Medir distancia</Text>
                        </View>
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
                            style={{width: width, height: 300}}
                            initialRegion={{
                                latitude: this.latitude,
                                longitude: this.longitude,
                                latitudeDelta: this.LATITUDE_DELTA,
                                longitudeDelta: this.LONGITUDE_DELTA,
                            }}
                            ref={c => this.mapView = c}
                            
                         >
                            {!!this.latitude && !!this.longitude && <MapView.Marker
                                    coordinate={{"latitude":this.latitude,"longitude":this.longitude}}
                                    title={this.locationData.name}
                                />
                            }

                            {
                                !!this.currentUserLatitude && !!this.currentUserLongitude && <MapView.Marker
                                coordinate={{"latitude":this.currentUserLatitude,"longitude":this.currentUserLongitude}}
                                title={"Your Position"} image={require('../../../assets/images/icons8-marker-100.png')}
                                />
                            }  

                            <MapViewDirections
                                origin={{latitude: this.currentUserLatitude, longitude: this.currentUserLongitude}}
                                destination={{latitude: this.latitude, longitude: this.longitude}}
                                apikey={this.API_KEY}
                                strokeWidth={3}
                                strokeColor="hotpink"
                                optimizeWaypoints={true}
                            />
                       
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
        backgroundColor: '#fff',
        paddingBottom: 20
    },
    navigationBar: {
        height: 60,
       flexDirection: 'row',
       justifyContent: 'space-between',
       elevation: 2,
       marginRight: 5
   },
   navigationItems: {
        marginVertical: 10,
        marginHorizontal: 10
    },
    shadowStyle: {
        marginBottom: 30,
        height: 1,
        backgroundColor: '#d6d6c2'
    },

    map: {
        width: 300,
        height: 200
    },
    styleHorizontalScrollView: {
        margin: 5
    },
    mapContainer: {
        overflow: 'hidden', 
        borderColor: '#dddddd', 
        borderRadius: 20, 
        borderWidth: 2
    },
    inviteMovies: {
        margin: 20,
        color: '#1cc9be',
        fontSize: 23,
        fontWeight: 'bold'
    },
    containerPlaces: {
        padding: 10
    },
    imageContainer: {
        backgroundColor: 'white',
        marginRight: 5,
        overflow: 'hidden',
        borderColor: '#dddddd', 
        borderRadius: 25/2,
        borderWidth: 1
    },
    nameAndKm: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
        borderColor: '#dddddd',
        borderRadius: 25,
        borderWidth: 1,
        paddingLeft: 10, 
        paddingRight: 10,
        borderRadius: 20
    }
})