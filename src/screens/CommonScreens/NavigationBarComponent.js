import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated} from 'react-native';
import { Button } from 'native-base';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default class NavigationBarComponent extends Component{

    constructor(props){
        super(props)
    }
    render(){
        return(
            <View style={styles.navigationBar} elevation={20}>
                <TouchableHighlight onPress={() => this.props.navigation.navigate('MyProfile')} style={styles.navigationItems}>
                    <Icon name="account-circle" style={{fontSize: 35, color: '#4DDFE5'}} />
                </TouchableHighlight>
                <TouchableHighlight style={styles.navigationItems} onPress={() => this.props.navigation.navigate('Activity')}>
                    <Icon name="mood" style={{fontSize: 35, color: '#1f1f14'}}/>
                </TouchableHighlight>
                <TouchableHighlight style={styles.navigationItems}>
                    <Icon name="message" style={{fontSize: 35, color: '#1f1f14'}}/>
                </TouchableHighlight>
            </View>
        )
    }
   
}

const styles = StyleSheet.create({
    navigationBar: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        elevation: 2
    },
    shadowStyle: {
        marginBottom: 30,
        height: 1,
        backgroundColor: '#d6d6c2'
    },
    navigationItems: {
        marginVertical: 15
    }
})