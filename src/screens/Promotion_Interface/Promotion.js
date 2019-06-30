import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImageOverlay from "react-native-image-overlay";

import {photos} from '../../../utils/assets'

import Geolocation from 'react-native-geolocation-service';


const { width } = Dimensions.get('window');




export default class Promotion extends Component{
    constructor(props){
        super(props)
        this.state = {
            latitude: 0,
            longitude: 0,
            error: null,
            loading: false
        }
    }


    componentDidMount() {
        this.setState({loading: true})
        if (hasLocationPermission) {
            Geolocation.getCurrentPosition(
                (position) => {
                    alert("Position datas: " + position)
                    this.setState({loading: false})
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }

        // navigator.geolocation.getCurrentPosition(
        //    (position) => {
        //      console.log("wokeeey");
        //      console.log(position);
        //      alert("Position: " + position)
        //      this.setState({
        //        latitude: position.coords.latitude,
        //        longitude: position.coords.longitude,
        //        error: null,
        //        loading: false
        //      });
        //    },
        //    (error) => this.setState({ error: error.message }),
        //    { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        //  );
       }
    


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