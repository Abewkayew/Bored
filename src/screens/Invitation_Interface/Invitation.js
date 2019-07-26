import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated, Platform,
        PermissionsAndroid, Alert} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base';

import Icon from 'react-native-vector-icons/MaterialIcons'

import Permissions from 'react-native-permissions'

import Firebase from '../../../utils/Config'
import {getDistanceFromLatLonInKm} from '../../../utils/getDistance'
const { width } = Dimensions.get('window')


const API_KEY = 'AIzaSyAizovCeZayRAZthl91it19QYFw1UF3-Jk' 

const _google_image_api = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&maxheight=200&photoreference='

export default class Invitation extends Component{
   constructor(props){
       super(props)
       this.state = {
        locationPermission: '',
        locationData: [],
        locationObject: {},
        currentUserLatitude: null,
        currentUserLongitude: null,
        customPhotoUrl: ''
        }
        this.actName = this.props.navigation.state.params.actName
        this.handlePromotionClick = this.handlePromotionClick.bind(this)
        this.dbRef = Firebase.database().ref()
   }

//    getNearbyLocations = (url) => {
//         axios
//         .get(url)
//         .then(data => {
//             this.setState({ locationData:data});
//         })
//         .catch(err => {
//             console.log(err);
//             return null;
//         })
//   }

   handlePromotionClick(activityName, result){
       this.props.navigation.navigate("Promotion",
                            {activityName: activityName, result: result})

   }

   shouldComponentUpdate(nextProps, nextState){
        return nextProps.locationData != this.state.locationData
    }


    componentDidMount() {
        this._requestPermission()
        this.callLocation()
        let that = this
        const {currentUser} = Firebase.auth()

        const userPath = this.dbRef.child('users')
        const currentUserDBPath = userPath.child(currentUser.uid)

        const newPlaces = Firebase.database().ref().child('places')

        const promo = newPlaces.child('promotions')
        
        newPlaces.once('value', dataSnapshot => {
            

            // dataSnapshot.child('promotions').child(promoID)

            // dataSnapshot.child('promotions').forEach(promotionDatas => {
            //     const promoData = promotionDatas.val()
            //     alert("Promotion Datas are: " + promoData)
            // })
            let places = []
            dataSnapshot.forEach(placesData => {
                const data = placesData.val()
                const placeImage = data.image
                const placeLatitude = data.latitude
                const placeLongitude = data.longitude
                const placeName = data.name
                const placeType = data.type
                const promotions = data.promotions


                const promotionArrays = []
                // promotionArrays.push(promotions)

                placesData.child('promotions').forEach(promoData => {
                    const proData = promoData.val()
                    promotionArrays.push(proData)
                })


                promo.once('value', dbs => {
                    dbs.forEach(data => {
                        const promoData = data.val()   
                        alert("Promo is: " + JSON.stringify(data))
                    })
                })


                // for (var i = 0; i < promotionArrays.length; i++){
                //     alert("Promotion data is: " + JSON.stringify(promotionArrays[i].promotions))
                // }

                // promotionArrays.forEach((data, index) => {
                //     // const promoData = data.promotion + index
                //     alert("Promotion data is: " + index)
                // })

                if(placeType === that.actName){

                    currentUserDBPath.once('value', dataSnap => {
                        const currentUserData = dataSnap.val()
                        const currentUserLatitude = currentUserData.latitude
                        const currentUserLongitude = currentUserData.longitude

                        that.setState({
                            currentUserLatitude: currentUserLatitude,
                            currentUserLongitude: currentUserLongitude
                        })

                        let distanceInBetween = getDistanceFromLatLonInKm(currentUserLatitude, currentUserLongitude,
                                                                          placeLatitude, placeLongitude)

                        distanceInBetween = distanceInBetween.toFixed(0)

                        const obj = {
                            image: placeImage,
                            latitude: placeLatitude,
                            longitude: placeLongitude,
                            name: placeName,
                            type: placeType,
                            promotion: promotionArrays,
                            distance: distanceInBetween,
                            userLatitude: currentUserLatitude,
                            userLongitude: currentUserLongitude
                        }
                        places.push(obj) 

                        
                    })

                   

                }



            })

            that.setState({
                locationData: places
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

    getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = parseFloat(position.coords.latitude)
                const longitude = parseFloat(position.coords.longitude)  
                this.setState({
                    currentUserLatitude: latitude,
                    currentUserLongitude: longitude  
                });
                // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2500&type=${this.actName}&key=${API_KEY}` 
                // this.getNearbyLocations(url);
            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
          );
    }

    callLocation(){
        
        this.watchID = navigator.geolocation.watchPosition((position) => {
            //Will give you the location on location change    
            this.setState({ currentUserLatitude:position.coords.latitude, currentUserLongitude: position.coords.longitude});
         });
    }
    componentWillUnmount = () => {
        navigator.geolocation.clearWatch(this.watchID)
        this.dbRef.off()
    }

    render(){
        let position = Animated.divide(this.scrollX, width);
        const {locationData, currentUserLatitude, currentUserLongitude} = this.state

        return(
                <View style={styles.containerPeople}>
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
                    
                   <ScrollView>
                    <View style={styles.tabViewStyle}>
                    <View style={styles.singleButtonContainer}>
                            <TouchableHighlight>
                                <Button   onPress={() => this.props.navigation.navigate('People', {activityName: this.actName})} 
                                rounded style={{backgroundColor: '#fff', padding: 5, width: 150, alignItems: 'center'}}>
                                    <Text style={{marginLeft: 15, fontWeight: 'bold', fontSize: 17, alignSelf: 'center'}}>Person</Text>
                                </Button>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.singleButtonContainer}>
                            <TouchableHighlight>
                                <Button  
                                rounded style={{backgroundColor: '#4DDFE5', padding: 5, width: 150, alignItems: 'center'}}>
                                    <Text style={styles.textInsideButton}>Invitation</Text>
                                </Button>
                            </TouchableHighlight>
                            
                        </View>

                    </View>
                    {
                            locationData.length === 0 ? (
                                <View style={{justifyContent: 'center', padding: 60}}>
                                    <Text style={{color: '#21CEFF', fontSize: 22}}>Loading Invitations</Text>
                                    <Spinner color="#21CEFF"/>
                                </View>
                            ): (
                                locationData.map((result, index)=>{
                                    return (
                                        <View style={styles.containerPlaces}>
                                            <View style={styles.imageContainer}>
                                                <TouchableHighlight 
                                                       onPress={() => this.handlePromotionClick(this.actName, result)}
                                                    >
                                                    <Image
                                                        source = {{uri: result.image}}
                                                        style={{width: width-50, height: 250, resizeMode:'cover'}}
                                                    />
                                                </TouchableHighlight>
                                            </View>
                                            <View style={styles.nameAndKm}>
                                                <Text style={{marginTop: 5, fontSize: 18, fontWeight: 'bold'}}>{result.name}</Text>
                                                {/* <Text>Photo References: {result.photos.photo_reference}</Text> */}
                                                { result.distance < 1000 ? (   
                                                        result.distance == 0 ? (
                                                            <Text style={{fontSize: 16, padding: 5}}>{result.distance} m</Text>
                                                        ): (
                                                            <Text style={{fontSize: 16, padding: 5}}>You are in the same place</Text>
                                                        )
                                                    ) :
                                                    (   
                                                        <Text style={{fontSize: 16, padding: 5}}>{(result.distance)/1000} km</Text>
                                                    )
                                                }
                                            </View>
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
        backgroundColor: '#fff',
        padding: 10
    },
    peopleNavBar: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 60
    },
    navigationBar: {
        height: 60,
       flexDirection: 'row',
       justifyContent: 'space-between',
       elevation: 2,
       marginRight: 5
   },
   navigationItems: {
        marginVertical: 10
    },
    shadowStyle: {
        marginBottom: 30,
        height: 1,
        backgroundColor: '#d6d6c2'
    },
    textInsideButton: {
        marginLeft: 15,
        fontWeight: 'bold',
        fontSize: 17,
        color: '#fff'
    },
    tabViewStyle: {
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    peopleImageStyle: {
        backgroundColor: 'white',
        marginTop: 20
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