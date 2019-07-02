import React, {Component} from 'react';

import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight}  from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';



export default class ActivityChooser extends Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return(
             <View>
                             
                 
                    </View>  
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#202020'
    },
    navigationBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 46,
        elevation: 10,
        padding: 10,

        // backgroundColor:'red'
    },
    logoImage: {
        flex: 1,
    },
    displayAllcards: {
        flex: 1,
        flexDirection: 'column',
        padding: 5
    },
    textTitle: {
        color: 'white',
        justifyContent: 'center',
        marginLeft: 20
    },
    displayActivities: {
        flex: 1,
        // backgroundColor: 'red',
        marginTop: 20
    },
    displayEachActivities: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 200,
        paddingTop: 20,
        borderRadius: 5
    }
});


