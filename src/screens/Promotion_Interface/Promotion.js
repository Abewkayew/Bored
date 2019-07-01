import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImageOverlay from "react-native-image-overlay";

import {photos} from '../../../utils/assets'

import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

import Permissions from 'react-native-permissions'



const { width } = Dimensions.get('window');




export default class Promotion extends Component{
    constructor(props){
        super(props)
        this.state = {
            latitude: 0,
            longitude: 0,
            error: null,
            loading: false,
            photoPermission: ''
        }
    }

    _requestPermission = () => {
        Permissions.request('photo').then(response => {
          // Returns once the user has chosen to 'allow' or to 'not allow' access
          // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
          this.setState({ photoPermission: response })
        })
      }



    async getLocationPermission(){
       const chckLocationPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (chckLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {
            alert("You've access for the location");
        } else {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Cool Location App required Location permission',
                        'message': 'We required Location permission in order to get device location ' +
                            'Please grant us.',
                        'buttonPositive': 'Grant',
                        'buttonNegative': 'Deny',
                        'buttonNeutral': 'cancel'
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    alert("You've access for the location");
                } else {
                    alert("You don't have access for the location");
                }
            } catch (err) {
                alert(err)
            }
        }



    }


    // async componentDidMount(){
    //     const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );

    //     if (granted) {
    //         alert("Permission Granted")
    //     } 
    //     else {
    //         alert("Permission Denied")
    //     }
    // }

    componentWillMount = () => {
        this._requestPermission();
        // this.getLocationPermission();
        this.setState({
            loading: true
          });    
        this.getCurrentLocation();   
        
        this.watchID = navigator.geolocation.watchPosition(
            position => {
              const { coordinate, routeCoordinates, distanceTravelled } = this.state;
              const { latitude, longitude } = position.coords;
      
              const newCoordinate = {
                latitude,
                longitude
              };
      
              if (Platform.OS === "android") {
                if (this.marker) {
                  this.marker._component.animateMarkerToCoordinate(
                    newCoordinate,
                    500
                  );
                }
              } else {
                coordinate.timing(newCoordinate).start();
              }
              alert("Latitude: " + latitude)
              this.setState({
                latitude,
                longitude,
                routeCoordinates: routeCoordinates.concat([newCoordinate]),
                distanceTravelled:
                  distanceTravelled + this.calcDistance(newCoordinate),
                prevLatLng: newCoordinate
              });
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          );   



    }

    

  componentWillUnmount() {

    navigator.geolocation.clearWatch(this.watchID);
  }


    getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let currentUserPosition = position.coords;
                alert(JSON.stringify(currentUserPosition));
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    loading: false
                  });
            },
            (error) => {
                alert("Error: " + error);
            },
            {
                enableHighAccuracy: false,
                timeout: 200,
                maximumAge: 0,
                distanceFilter: 10
            }
        );
    }


    // componentDidMount() {
    //     this.setState({loading: true})
    //     // // if (hasLocationPermission) {
    //     //     Geolocation.getCurrentPosition(
    //     //         (position) => {
    //     //             alert("Position datas: " + position)
    //     //             this.setState({loading: false})
    //     //         },
    //     //         (error) => {
    //     //             // See error code charts below.
    //     //             console.log(error.code, error.message);
    //     //         },
    //     //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //     //     );
    //     // }
    //     alert('Before Data Fetch')
    //     navigator.geolocation.getCurrentPosition(
    //        (position) => {
    //          console.log("wokeeey");
    //          console.log(position);
    //          alert("Position: ")
    //          this.setState({
    //            latitude: position.coords.latitude,
    //            longitude: position.coords.longitude,
    //            error: null,
    //            loading: false
    //          });
    //        },
    //        (error) => alert("Cannot get Location: " + error),
    //        { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    //      );
    //    }
    


    render(){
        const {latitude, longitude, loading} = this.state; 

        return(
            <View style={styles.containerProfile}>

                <TouchableHighlight onPress={() => this.props.navigation.navigate('Activity')}>
                    <Icon name="arrow-left" color="#202020" size={30}/>
                </TouchableHighlight>
                <Text>Latitude and Longitude SImulations:</Text>
    
                {
                    loading ? (
                        <View style={{padding: 60}}>
                                      <Spinner color="red"/>
                                  </View>
                    ) : (
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text>Latitude: {latitude}</Text>
                            <Text>Longitude: {longitude}</Text>
                        </View>
         
                    )
                }
            
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