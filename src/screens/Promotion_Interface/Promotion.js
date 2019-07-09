import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated, Platform} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
        const that = this

        // display custom photos if real photoes are not available
        const customPhotoPath = Firebase.database().ref().child('custom_photos')

        customPhotoPath.once('value', (dataSnapshot) => {
            
            dataSnapshot.forEach((child) => {
                const data = child.val()
                const photoUrl = data.photo
                const rank = data.rank

                if(this.actName === 'game' && rank === 50){
                    that.setState({
                        customPhotoUrl: photoUrl
                    })    
                } else if(this.actName === 'bar' && rank === 8){
                    that.setState({
                        customPhotoUrl: photoUrl
                    })    
                }else if(this.actName === 'movie_theater' && rank === 50){
                    that.setState({
                        customPhotoUrl: photoUrl
                    })    
                }else if(this.actName === 'gym' && rank === 70){
                    that.setState({
                        customPhotoUrl: photoUrl
                    })    
                    // asdfasdf
                }else if(this.actName === 'restaurant' && rank === 5){
                    that.setState({
                        customPhotoUrl: photoUrl
                    })    
                }else if(this.actName === 'cafe' && rank === 0){
                    that.setState({
                        customPhotoUrl: photoUrl
                    })    
                }
            })

        })

    }

    render(){
        
        const {customPhotoUrl} = this.state

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
                                            source={{uri: `${customPhotoUrl}`}}
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
                        {
                            this.actName === "movie_theater" ? (
                                <View style={styles.styleHorizontalScrollView}>
                                {/* begin */}
                                 <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20 }}>
     
                                     <View style={{ height: 130, marginTop: 20, marginBottom: 10}}>
                                         <ScrollView
                                             horizontal={true}
                                             showsHorizontalScrollIndicator={false}
                                         >
                                             <Category imageUri={{uri: 'https://firebasestorage.googleapis.com/v0/b/boredapp-11e1d.appspot.com/o/promotions%2Fasd.jpg?alt=media&token=c7ba6607-fd6d-45ab-b2d6-e5656307f13b'}}
                                             />
                                             <Category imageUri={{uri: 'https://firebasestorage.googleapis.com/v0/b/boredapp-11e1d.appspot.com/o/promotions%2Fpromocion%20-%20mdconalds%201.jpg?alt=media&token=3cc95607-0760-4073-8ce3-6f3ac40abe77'}}
                                              />
                                             <Category imageUri={{uri: 'https://firebasestorage.googleapis.com/v0/b/boredapp-11e1d.appspot.com/o/promotions%2Fpromocion%20-%20mdconalds%202.jpg?alt=media&token=30e2c3f0-9529-4cb3-881f-2225bb7ca9f0'}}
                                              />
                                         </ScrollView>
                                     </View>
                                     
                                 </View>          
                                {/* end */}
                            </View>
     
                            ) : (
                                <SecondCategory imageUri={{uri: 'https://firebasestorage.googleapis.com/v0/b/boredapp-11e1d.appspot.com/o/promotions%2FMcDonalds.jpg?alt=media&token=252ae210-2618-4f89-9efd-7d6f260131ca'}}/>
                            )
                        }                
                      

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
                            style={{width: width-30, padding: 10, marginRight: 5, height: 300}}
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
    },
    styleHorizontalScrollView: {
        margin: 5
    },
    mapContainer: {
        overflow: 'hidden', 
        borderColor: '#dddddd', 
        borderRadius: 20, 
        borderWidth: 2
    }
});