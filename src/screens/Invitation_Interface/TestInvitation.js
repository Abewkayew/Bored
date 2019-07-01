import React from 'react';
//import react in our code. 

import {View, Text,  StyleSheet, Image ,PermissionsAndroid,Platform} from 'react-native';
//import all the components we are going to use.

export default class TestInvitation extends React.Component {
    state = {
        currentLongitude: 'unknown',//Initial Longitude
        currentLatitude: 'unknown',//Initial Latitude
    }
    componentDidMount = () => {
        var that =this;
        //Checking for the permission just after component loaded
        if(Platform.OS === 'ios'){
            this.callLocation(that);
        }else{
            async function requestCameraPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                            'title': 'Location Access Required',
                            'message': 'This App needs to Access your location'
                        }
                    )
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        //To Check, If Permission is granted
                        that.callLocation(that);
                    } else {
                        alert("Permission Denied");
                    }
                } catch (err) {
                    alert("err",err);
                    console.warn(err)
                }
            }
            requestCameraPermission();
        }    
    }
    callLocation(that){
        //alert("callLocation Called");
        navigator.geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                const currentLongitude = JSON.stringify(position.coords.longitude);
                //getting the Longitude from the location json
                const currentLatitude = JSON.stringify(position.coords.latitude);
                //getting the Latitude from the location json
                that.setState({ currentLongitude:currentLongitude });
                //Setting state Longitude to re re-render the Longitude Text
                that.setState({ currentLatitude:currentLatitude });
                //Setting state Latitude to re re-render the Longitude Text
            },
            (error) => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
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
    render() {
        return (
            <View style = {styles.container}>
                <Image
                    source={{uri:'https://png.icons8.com/dusk/100/000000/compass.png'}}
                    style={{width: 100, height: 100}}
                />
                <Text style = {styles.boldText}>
                    You are Here
                </Text>
                <Text style={{justifyContent:'center',alignItems: 'center',marginTop:16}}>
                    Longitude: {this.state.currentLongitude}
                </Text>
                <Text style={{justifyContent:'center',alignItems: 'center',marginTop:16}}>
                    Latitude: {this.state.currentLatitude}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        marginTop: 50,
        padding:16,
        backgroundColor:'white'
    },
    boldText: {
        fontSize: 30,
        color: 'red',
    }
})