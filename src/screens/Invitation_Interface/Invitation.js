import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated, Platform,
        PermissionsAndroid, Alert} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Permissions from 'react-native-permissions'
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';

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
        lat: 9.0397084,
        lng: 38.7624379 ,
        customPhotos: []
        }
    this.actName = this.props.navigation.state.params.actName 
    // this.type = actName
    
   }

   getNearbyLocations = () => {
    this.url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.state.lat},${this.state.lng}&radius=2500&type=${this.actName}&key=${API_KEY}`
    axios
    .get(this.url)
    .then(data => {
        this.setState({ locationData:data});

    })
    .catch(err => {
        console.log(err);
        return null;
    });
   }

   testCustomPhotos = () => {
       console.log("Custom Photos are: " + this.state.customPhotos)
     
    }

   getCustomPhotos = () => {
    const customPhotoPath = Firebase.database().ref().child('custom_photos');
    customPhotoPath.on('value', (dataSnapshot) => {
            var photoDatas = [];
            dataSnapshot.forEach((child) => {
                photoDatas.push({
                    photo: child.val().photo,
                    rank: child.val().rank
                })    
            });
            this.setState({
                customPhotos: photoDatas
            })

        }) 

        
   }


    componentDidMount() {
        this.getCustomPhotos()
        this.testCustomPhotos()
        this._requestPermission()
        this.getNearbyLocations()
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
                this.getCurrentLocation();
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
    
      // This is a common pattern when asking for permissions.
      // iOS only gives you once chance to show the permission dialog,
      // after which the user needs to manually enable them from settings.
      // The idea here is to explain why we need access and determine if
      // the user will say no, so that we don't blow our one chance.
      // If the user already denied access, we can ask them to enable it from settings.
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





    // componentDidMount = () => {
    //     var that =this;
    //     //Checking for the permission just after component loaded
    //         Permissions.request('location', { type: 'always' }).then(response => {
                
    //             if(response == 'authorized'){
    //                 alert("Authorized")
    //             }else if(response == 'denied'){
    //                 alert("Denied")
    //             }else if(response == 'restricted'){
    //                 alert("Restricted")
    //             }else if(response == 'undetermined'){
    //                 alert("Undetermined")
    //             }else{
    //                 alert("Not anyone of these")
    //             }

    //             this.setState({ locationPermission: response })
    //           })
              
    //         // async function requestCameraPermission() {
    //         //     try {
    //         //         const granted = await PermissionsAndroid.request(
    //         //             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
    //         //                 'title': 'Location Access Required',
    //         //                 'message': 'This App needs to Access your location'
    //         //             }
    //         //         )
    //         //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         //             //To Check, If Permission is granted
    //         //             that.callLocation(that);
    //         //         } else {
    //         //             alert("Permission Denied");
    //         //         }
    //         //     } catch (err) {
    //         //         alert("err" + err);
    //         //         console.warn(err)
    //         //     }
    //         // }

           

    //         // requestCameraPermission();
    //     }    

    getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                     this.setState({ lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude) });
            
            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
          );
    }


    callLocation(){
        
        that.watchID = navigator.geolocation.watchPosition((position) => {
            //Will give you the location on location change
            console.log(position);
            const currentLongitude = JSON.stringify(position.coords.longitude);
            //getting the Longitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);
            //getting the Latitude from the location json
            that.setState({ currentLongitude:currentLongitude });
            //Setting state Longitude to re re-render the Longitude Text
            that.setState({ currentLatitude:currentLatitude });
            //Setting state Latitude to re re-render the Longitude Text
        });
    }
    componentWillUnmount = () => {
        navigator.geolocation.clearWatch(this.watchID);
    }


    render(){
        // position will e a value between 0 and photos.length - 1 assuming you don't scroll pass the ends of the ScrollView
        let position = Animated.divide(this.scrollX, width);
        // const actName = this.props.navigation.state.params.activityName 
        // alert("ActName: " + actName)    

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
                                    <Button  onPress={() => this.props.navigation.navigate('People', {activityName: 'Drink'})} 
                                            bordered light style={{width: 150, justifyContent: 'center'}}>
                                        <Text style={{color: 'white'}}>personas</Text>
                                    </Button>
                                </TouchableHighlight>
                                <TouchableHighlight>
                                    <Button  onPress={() => this.props.navigation.navigate('Invitation', {actName: this.state.actName})}
                                            bordered light style={{width: 150, justifyContent: 'center'}}>
                                        <Text style={{color: 'white'}}>invitaciones</Text>
                                    </Button>
                                </TouchableHighlight>
                        </View>
                    {
                            this.state.locationData.length === 0 ? (
                                <Spinner color="red"/>
                            ): (
                                this.state.locationData.data.results.map((result, index)=>{
                                    return (
                                        <View style={{backgroundColor: 'green', padding: 10}}>
                                            
                                             {
                                                 result.photos ? 
                                                    (
                                                    <View>
                                                        <Image
                                                            source = {{uri: `${_google_image_api}${result.photos[0].photo_reference}&key=${API_KEY}`}}
                                                            style={{width: width, height: 200, resizeMode:'cover'}}
                                                        />
                                                    </View>
                                                )
                                                 : (
                                                     <Image
                                                        source={require('../../../assets/images/kfc.jpg')}
                                                        style={{width: width, height: 150}}
                                                      />
                                                 )
                                             }
                                              <Text style={{color: 'white', marginTop: 5, fontSize: 20}}>Name: {result.name}</Text>
                                              {/* <Text>Photo References: {result.photos.photo_reference}</Text> */}
                                              <Text style={{color: 'white'}}>{result.vicinity}</Text>
                                              <View style={{backgroundColor: '#d9d9c1', width: width, height: 1, marginTop: 5}}></View>  
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