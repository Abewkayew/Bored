import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImageOverlay from "react-native-image-overlay";
const { width } = Dimensions.get('window');


export default class SingleChat extends Component{
    constructor(props){
        super(props)
        this.actName = this.props.navigation.state.params.actName 
    }
   

    render(){
    
        return(
            <View style={styles.containerSingleChat}>
                    <View style={styles.singleChatNavBar}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('People', {activityName: this.actName})}>
                            <Icon name="arrow-left" color="white" size={30}/>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Profile', {actName: this.actName})}>
                            <Image source={{uri: 'https://randomuser.me/api/portraits/women/88.jpg'}}
                                   style={{width: 50, height: 50, borderRadius: 80/ 2, left: 20}}/>
                        </TouchableHighlight>
                        <Text style={{color: 'white', fontSize: 20, left: 30}}>Daniela, 27</Text>
                    </View>
                    <ScrollView>
                            
                            <View style={{padding: 10, marginTop: 20, marginBottom: 20}}>
                                <View style={{backgroundColor: '#148c9b', borderRadius: 50/2, padding: 15, marginTop: 10, alignSelf:'baseline'}}>
                                    <Text style={{color: 'white'}}>How are you man?</Text>
                                </View>
                                <View style={{backgroundColor: '#148c9b', borderRadius: 50/2, padding: 15, marginTop: 10, alignSelf:'baseline'}}>
                                    <Text style={{color: 'white'}}>How are you man?</Text>
                                </View>
                                <View style={{backgroundColor: '#148c9b', borderRadius: 50/2, padding: 15, marginTop: 10, alignSelf:'baseline'}}>
                                    <Text style={{color: 'white'}}>How are you man?</Text>
                                </View>
                                <View style={{backgroundColor: '#148c9b', borderRadius: 50/2, padding: 15, marginTop: 10, alignSelf:'baseline'}}>
                                    <Text style={{color: 'white'}}>How are you man?</Text>
                                </View>
                                <View style={{backgroundColor: '#148c9b', borderRadius: 50/2, padding: 15, marginTop: 10, alignSelf:'baseline'}}>
                                    <Text style={{color: 'white'}}>How are you man?</Text>
                                </View>
                                <View style={{backgroundColor: '#148c9b', borderRadius: 50/2, padding: 15, marginTop: 10, alignSelf:'baseline'}}>
                                    <Text style={{color: 'white'}}>How are you man?</Text>
                                </View>
                                <View style={{backgroundColor: '#148c9b', borderRadius: 50/2, padding: 15, marginTop: 10, alignSelf:'baseline'}}>
                                    <Text style={{color: 'white'}}>How are you man?</Text>
                                </View>
                                
                                <View style={{backgroundColor: '#148c9b', borderRadius: 50/2, padding: 15, marginTop: 10, alignSelf:'baseline'}}>
                                    <Text style={{color: 'white'}}>How are you man?</Text>
                                </View>
                                <View style={{backgroundColor: '#148c9b', borderRadius: 50/2, padding: 15, marginTop: 10, alignSelf:'baseline'}}>
                                    <Text style={{color: 'white'}}>How are you man?</Text>
                                </View>
                                <View style={{backgroundColor: '#148c9b', borderRadius: 50/2, padding: 15, marginTop: 10, alignSelf:'baseline'}}>
                                    <Text style={{color: 'white'}}>How are you man?</Text>
                                </View>
                            </View>
                                
                        </ScrollView> 
                    
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerSingleChat: {
        flex: 1,
        backgroundColor: '#fff'
    },
    singleChatNavBar: {
        backgroundColor: '#036470',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 60,
        padding: 3
    }
});