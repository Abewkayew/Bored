import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated, Platform,
        PermissionsAndroid, Alert} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Permissions from 'react-native-permissions'
import axios from 'axios';

import Firebase from '../../../utils/Config';

import ImageOverlay from "react-native-image-overlay";
const { width } = Dimensions.get('window');


const API_KEY = 'AIzaSyAizovCeZayRAZthl91it19QYFw1UF3-Jk' 

const _google_image_api = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&maxheight=200&photoreference='

export default class Invitation extends Component{
   constructor(props){
       super(props)
       this.state = {
        currentLongitude: 'unknown',//Initial Longitude
        currentLatitude: 'unknown',//Initial Latitude
        locationPermission: '',
        locationData: [],
        locationObject: {},
        latitude: 0.0,
        longitude: 0.0,
        customPhotoUrl: ''
        }
        this.actName = this.props.navigation.state.params.actName
        this.handlePromotionClick = this.handlePromotionClick.bind(this);
   }

   getNearbyLocations = (url) => {
        axios
        .get(url)
        .then(data => {
            this.setState({ locationData:data});
        })
        .catch(err => {
            console.log(err);
            return null;
        })
  }

   handlePromotionClick(activityName, result, lat, lng, image_api, customPhotoUrl){
       this.props.navigation.navigate("Promotion",
                            {activityName: activityName, result: result, 
                            lat: lat, lng: lng, image_api: image_api, customPhotoUrl: customPhotoUrl})
   }

   shouldComponentUpdate(nextProps, nextState){
        return nextProps.locationData != this.state.locationData
    }


    componentDidMount() {
        this._requestPermission()
        this.callLocation()
        let that = this

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
    
      // Request permission to access photos
      _requestPermission = () => {
        Permissions.request('location').then(response => {
          // Returns once the user has chosen to 'allow' or to 'not allow' access
          // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
          this.setState({ photoPermission: response })
          if(response == 'restricted'){
            //  alert('restricted')
          }else if(response == 'authorized'){
                this.getCurrentLocation()
          } else {
              alert('Not any one of them')
          }
        })
      }
    
      // Check the status of multiple permissions
      _checkCameraAndPhotos = () => {
        Permissions.checkMultiple(['camera', 'photo']).then(response => {
          //response is an object mapping type to permission
          this.setState({
            cameraPermission: response.camera,
            photoPermission: response.photo,
          })
        })
      }
      _alertForPhotosPermission() {
        Alert.alert(
          'Can we access your photos?',
          'We need access so you can set your profile pic',
          [
            {
              text: 'No way',
              onPress: () => console.log('Permission denied'),
              style: 'cancel',
            },
            this.state.photoPermission == 'restricted'
              ? { text: 'OK', onPress: this._requestPermission }
              : { text: 'Open Settings', onPress: Permissions.openSettings },
          ],
        )
      }


    getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = parseFloat(position.coords.latitude)
                const longitude = parseFloat(position.coords.longitude)  
                this.setState({
                    latitude: latitude,
                    longitude: longitude  
                });
                const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2500&type=${this.actName}&key=${API_KEY}` 
                this.getNearbyLocations(url);
            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
          );
    }

    callLocation(){
        
        this.watchID = navigator.geolocation.watchPosition((position) => {
            //Will give you the location on location change    
            this.setState({ lat:position.coords.latitude, lng: position.coords.longitude});
         });
    }
    componentWillUnmount = () => {
        navigator.geolocation.clearWatch(this.watchID);
    }


    render(){
        let position = Animated.divide(this.scrollX, width);
        const {locationData, customPhotoUrl} = this.state
        
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
                            <Button  onPress={() => this.props.navigation.navigate('People', {activityName: this.actName})} 
                                    bordered light style={{width: 150, justifyContent: 'center'}}>
                                <Text style={{color: 'white', fontWeight: "bold"}}>personas</Text>
                            </Button>
                        </TouchableHighlight>
                        <TouchableHighlight>
                            <Button bordered light style={{width: 150, justifyContent: 'center'}}>
                                <Text style={{color: 'white', fontWeight: "bold"}}>invitaciones</Text>
                            </Button>
                        </TouchableHighlight>
                    </View>
                    {
                            locationData.length === 0 ? (
                                <View style={{justifyContent: 'center', padding: 60}}>
                                    <Text style={{color: 'red', fontSize: 22}}>Loading invitaciones</Text>
                                    <Spinner color="red"/>
                                </View>
                            ): (
                                locationData.data.results.map((result, index)=>{
                                    return (
                                        <View style={{backgroundColor: 'white', padding: 10, marginTop: 5, marginRight: 5, borderRadius: 25/2}}>
                                             {
                                                 result.photos ? 
                                                    (
                                                    <View>
                                                        <TouchableHighlight 
                                                           onPress={() => this.handlePromotionClick(this.actName, result, 
                                                            this.state.latitude, this.state.longitude, _google_image_api)}>
                                                            <Image
                                                                source = {{uri: `${_google_image_api}${result.photos[0].photo_reference}&key=${API_KEY}`}}
                                                                style={{width: width-50, height: 200, resizeMode:'cover'}}
                                                            />
                                                        </TouchableHighlight>
                                                    </View>
                                                )
                                                 : (
                                                    // display the images from Firebase Database...
                                                    <View>
                                                        <TouchableHighlight
                                                          onPress={() => this.handlePromotionClick(this.actName, result, 
                                                                          this.state.latitude, this.state.longitude, customPhotoUrl)}>
                                                            {/* <Image
                                                                source={require('../../../assets/images/kfc.jpg')}
                                                                style={{width: width-50, height: 150}}
                                                            /> */}
                                                            <Image
                                                                source={{uri: `${customPhotoUrl}`}}
                                                                style={{width: width-50, height: 200, resizeMode:'cover'}}
                                                            />
                                                        </TouchableHighlight>
                                                    </View>
                                                 )
                                             }
                                              <Text style={{marginTop: 5, fontSize: 20}}>{result.name}</Text>
                                              {/* <Text>Photo References: {result.photos.photo_reference}</Text> */}
                                              <Text>{result.vicinity}</Text> 

                                        </View>
                                    )
                                })
                                
                            )
                        }

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
        flexDirection:'row',
        justifyContent: 'space-between',
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