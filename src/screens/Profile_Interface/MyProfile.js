import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImageOverlay from "react-native-image-overlay";

import {photos} from '../../../utils/assets'

const { width } = Dimensions.get('window');


export default class MyProfile extends Component{

    render(){

        return(
            <View style={styles.containerProfile}>
                
                <TouchableHighlight onPress={() => this.props.navigation.navigate('Activity')}>
                    <Icon name="arrow-left" color="#202020" size={30}/>
                </TouchableHighlight>

                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text>My Profile Screen</Text>
                </View>
            
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