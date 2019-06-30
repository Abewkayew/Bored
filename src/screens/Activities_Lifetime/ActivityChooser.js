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
                             
                 
                    <View style={styles.displayAllcards}>
                        <Text style={styles.textTitle}>Tendencias de la Zona</Text>
                        <Text style={{color: 'white', alignContent: 'center'}}>!Elige tu actividad favorita y encuentra 
                        gente que busca lo mismo!</Text>
                    <View style={styles.displayActivities}>
                        
                        <View style={styles.displayEachActivities}>
                            
                            <TouchableHighlight onPress={this.props.handleClick} disabled>
                                <Card>
                                    <CardItem cardBody bordered>
                                            <Image source={require('../../../assets/images/ico_game.jpg')} style={{height: 120, width: 150}}/>
                                    </CardItem>
                                    <CardItem bordered>
                                    <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                        <Icon name="account-circle" style={{fontSize: 24}}/>
                                        <Text style={{fontSize:18, marginLeft: 5}}>4</Text>
                                    </Body>
                                    </CardItem>
                                </Card>
                            </TouchableHighlight>

                            <TouchableHighlight onPress={this.props.handleClick} disabled>
                                <Card>
                                    <CardItem cardBody bordered>
                                        <Image source={require('../../../assets/images/ico_teatro.jpg')} style={{height: 120, width: 150}}/>
                                    </CardItem>
                                    <CardItem bordered>
                                    <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                        <Icon name="account-circle" style={{fontSize: 24}}/>
                                        <Text style={{fontSize: 18, marginLeft: 5}}>4</Text>
                                    </Body>
                                    </CardItem>
                                </Card>
                            </TouchableHighlight>


                        </View>

                                {/* Second Card View */}

                    <View style={styles.displayEachActivities}>
                            {/* <Text style={{color: 'white'}}>Left Side</Text>
                            <Text style={{color: 'white'}}>Right Side</Text> */}
                            
                        <TouchableHighlight onPress={this.props.handleClick}>
                                <Card>
                                    <CardItem cardBody bordered>
                                        <Image source={require('../../../assets/images/ico_chela.jpg')} style={{height: 120, width: 150}}/>
                                    </CardItem>
                                    <CardItem bordered>
                                    <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                        <Icon name="account-circle" style={{fontSize: 24}}/>
                                        <Text style={{fontSize: 18, marginLeft: 5}}>4</Text>
                                    </Body>
                                    </CardItem>
                                </Card>
                        </TouchableHighlight>

                        <TouchableHighlight onPress={this.props.handleClick}>
                                <Card>
                                    <CardItem cardBody bordered>
                                        <Image source={require('../../../assets/images/ico_deporte.jpg')} style={{height: 120, width: 150}}/>
                                    </CardItem>
                                    <CardItem bordered>
                                    <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                        <Icon name="account-circle" style={{fontSize: 24}}/>
                                        <Text style={{fontSize: 18, marginLeft: 5}}>4</Text>
                                    </Body>
                                    </CardItem>
                                </Card>
                        </TouchableHighlight>

                        </View>

                        <View style={styles.displayEachActivities}>
                            {/* <Text style={{color: 'white'}}>Left Side</Text>
                            <Text style={{color: 'white'}}>Right Side</Text> */}
                            
                            
                            <TouchableHighlight onPress={this.props.handleClick}>
                                <Card>
                                    <CardItem cardBody bordered>
                                        <Image source={require('../../../assets/images/ico_cafe.jpg')} style={{height: 120, width: 150}}/>
                                    </CardItem>
                                    <CardItem bordered>
                                    <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                        <Icon name="account-circle" style={{fontSize: 24}}/>
                                        <Text style={{fontSize: 18, marginLeft: 5}}>4</Text>
                                    </Body>
                                    </CardItem>
                                </Card>
                            </TouchableHighlight>

                            <TouchableHighlight onPress={this.props.handleClick}>
                                <Card>
                                    <CardItem cardBody bordered>
                                        <Image source={require('../../../assets/images/ico_restaurante.jpg')} style={{height: 120, width: 150}}/>
                                    </CardItem>
                                    <CardItem bordered>
                                    <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                        <Icon name="account-circle" style={{fontSize: 24}}/>
                                        <Text style={{fontSize: 18, marginLeft: 5}}>4</Text>
                                    </Body>
                                    </CardItem>
                                </Card>
                                </TouchableHighlight>

                            </View>
                            
                            </View>
                        </View>
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


