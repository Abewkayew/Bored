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
        customPhotos: [],
        latitude: 0.0,
        longitude: 0.0,
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


   handlePromotionClick(activityName, result, lat, lng, image_api){
       this.props.navigation.navigate("Promotion",{activityName: activityName, result: result, lat: lat, lng: lng, image_api, image_api})
   }

   shouldComponentUpdate(nextProps, nextState){
        return nextProps.locationData != this.state.locationData
    }


    componentDidMount() {
        this.getCustomPhotos()
        this.testCustomPhotos()
        this._requestPermission()
        this.callLocation();
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
                                    <Button  onPress={() => this.props.navigation.navigate('People', {activityName: this.actName})} 
                                            bordered light style={{width: 150, justifyContent: 'center'}}>
                                        <Text style={{color: 'white'}}>personas</Text>
                                    </Button>
                                </TouchableHighlight>
                                <TouchableHighlight>
                                    <Button bordered light style={{width: 150, justifyContent: 'center'}}>
                                        <Text style={{color: 'white'}}>invitaciones</Text>
                                    </Button>
                                </TouchableHighlight>
                        </View>
                    {
                            this.state.locationData.length === 0 ? (
                                <View style={{justifyContent: 'center', padding: 60}}>
                                    <Text style={{color: 'red', fontSize: 22}}>Loading invitaciones</Text>
                                    <Spinner color="red"/>
                                </View>
                            ): (
                                this.state.locationData.data.results.map((result, index)=>{
                                    return (
                                        <View style={{backgroundColor: 'white', padding: 10, marginTop: 5, marginRight: 5, borderRadius: 25/2}}>
                                             {
                                                 result.photos ? 
                                                    (
                                                    <View>
                                                        <TouchableHighlight onPress={() => this.handlePromotionClick(this.actName, result, this.state.latitude, this.state.longitude,
                                                                    _google_image_api)}>
                                                            <Image
                                                                source = {{uri: `${_google_image_api}${result.photos[0].photo_reference}&key=${API_KEY}`}}
                                                                style={{width: width-50, height: 200, resizeMode:'cover'}}
                                                            />
                                                        </TouchableHighlight>
                                                    </View>
                                                )
                                                 : (
                                                    <View>
                                                        <TouchableHighlight onPress={() => this.handlePromotionClick(this.actName, result, this.state.latitude, this.state.longitude)}>
                                                            <Image
                                                                source={require('../../../assets/images/kfc.jpg')}
                                                                style={{width: width-50, height: 150}}
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