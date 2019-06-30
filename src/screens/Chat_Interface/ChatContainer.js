import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImageOverlay from "react-native-image-overlay";
const { width } = Dimensions.get('window');

export default class ChatContainer extends Component{
    
    render(){
        return(
            <View style={styles.containerChat}>
                    <View style={styles.chatNavBar}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Activity')}>
                            <Icon name="arrow-left" color="white" size={30}/>
                        </TouchableHighlight>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold', left: 30}}>i
                            <Text style={{color: 'white', fontSize: 20, textDecorationLine: 'underline',
                               fontWeight: 'bold', paddingBottom: 10}}>No te aburras</Text>!
                        </Text>
                    </View>
                    <ScrollView>
                    <View style={{paddingBottom: 20}}>

                        {/* first card */}

                        <Card style={{borderRadius: 30/2, borderColor: 'green', flexDirection: 'row', padding: 5}}>
                            <CardItem cardBody bordered style={{flexDirection: 'row', justifyContent: 'center', margin: 3}}>
                                    <Image source={{uri: 'https://randomuser.me/api/portraits/women/85.jpg'}}
                                        style={{width: 70, height: 70, borderRadius: 80/ 2}}/>
                            </CardItem>
                            <CardItem style={{flexDirection: 'column', alignItems: 'flex-start', margin: 3}}>
                                <Text style={{fontSize: 16, fontWeight:'bold'}}>Daniela, 27</Text>
                                <Text style={{fontSize: 14, marginLeft: 5}}>Hey man?</Text>


                                <View style={{flexDirection: 'row'}}>
                                    <View // we will animate the opacity of the dots later, so use Animated.View instead of View here
                                        style={{height: 1, width: 150, backgroundColor: '#202020', margin: 5, 
                                        borderRadius: 10, marginTop: 8}}
                                        />
                                    <Button rounded bordered
                                        style={{width: 20,backgroundColor: 'blue', alignItems: 'center', left: 25,
                                            height: 20, justifyContent: 'center', borderColor: 'green'}}>
                                        <Text style={{color: 'white'}}>1</Text>
                                    </Button>
                                    
                                </View>

                                <View style={{flexDirection: 'row'}}>
                                    <Button rounded bordered
                                        style={{width: 30,backgroundColor: 'white',
                                            height: 30, justifyContent: 'center', borderColor: 'green'}}>
                                        <Image source={require('../../../assets/images/search_1.png')} style={{width: 15, height: 15}}/>
                                    </Button>  
                                    <Text style={{fontSize: 13, paddingLeft: 5, marginTop: 3}}>Quirro ir al cine con alguien</Text>
                                </View>
                                <Text style={{fontSize: 10, fontWeight: 'bold', left: 150}}>12PM</Text>
                            </CardItem>
                            
                        </Card>
                        
                        {/* second card */}
                        
                        <Card style={{borderRadius: 30/2, borderColor: 'green', flexDirection: 'row', padding: 5}}>
                            <CardItem cardBody bordered style={{flexDirection: 'row', justifyContent: 'center', margin: 3}}>
                                    <Image source={{uri: 'https://randomuser.me/api/portraits/women/79.jpg'}}
                                        style={{width: 70, height: 70, borderRadius: 80/ 2}}/>
                            </CardItem>
                            <CardItem style={{flexDirection: 'column', alignItems: 'flex-start', margin: 3}}>
                                <Text style={{fontSize: 16, fontWeight:'bold'}}>Daniela, 27</Text>
                                <Text style={{fontSize: 14, marginLeft: 5}}>Hey man?</Text>


                                <View style={{flexDirection: 'row'}}>
                                    <Button rounded bordered
                                        style={{width: 40,backgroundColor: 'white',
                                            height: 40, justifyContent: 'center'}}>
                                        <Image source={require('../../../assets/images/icon_ok.png')} style={{width: 40, height: 40}}/>
                                    </Button> 
                                    <Button rounded bordered
                                        style={{width: 40,backgroundColor: 'white',left: 20,
                                            height: 40, justifyContent: 'center'}}>
                                        <Image source={require('../../../assets/images/icon_cancel.png')} style={{width: 40, height: 40}}/>
                                    </Button> 
                                    <Button rounded bordered
                                        style={{width: 20,backgroundColor: 'blue', alignItems: 'center', left: 100,
                                            height: 20, justifyContent: 'center', borderColor: 'green'}}>
                                        <Text style={{color: 'white'}}>4</Text>
                                    </Button>
                                    
                                </View>

                                <View style={{flexDirection: 'row', marginTop: 3}}>
                                    <Button rounded bordered
                                        style={{width: 30,backgroundColor: 'white',
                                            height: 30, justifyContent: 'center', borderColor: 'green'}}>
                                        <Image source={require('../../../assets/images/search_1.png')} style={{width: 15, height: 15}}/>
                                    </Button>  
                                    <Text style={{fontSize: 13, paddingLeft: 5, marginTop: 3}}>Quirro ir al cine con alguien</Text>
                                </View>
                                <Text style={{fontSize: 10, fontWeight: 'bold', left: 150}}>12PM</Text>
                            </CardItem>
                            
                        </Card>

                        {/* third card */}

                       <Card style={{borderRadius: 30/2, borderColor: 'green', flexDirection: 'row', padding: 5}}>
                            <CardItem cardBody bordered style={{flexDirection: 'row', justifyContent: 'center', margin: 3}}>
                                    <Image source={{uri: 'https://randomuser.me/api/portraits/women/80.jpg'}}
                                        style={{width: 70, height: 70, borderRadius: 80/ 2}}/>
                            </CardItem>
                            <CardItem style={{flexDirection: 'column', alignItems: 'flex-start', margin: 3}}>
                                <Text style={{fontSize: 16, fontWeight:'bold'}}>Daniela, 27</Text>
                                <Text style={{fontSize: 14, marginLeft: 5}}>Hey man?</Text>


                                <View style={{flexDirection: 'row'}}>
                                    <View // we will animate the opacity of the dots later, so use Animated.View instead of View here
                                        style={{height: 1, width: 150, backgroundColor: '#202020', margin: 5, 
                                        borderRadius: 10, marginTop: 8}}
                                        />
                                    <Button rounded bordered
                                        style={{width: 20,backgroundColor: 'blue', alignItems: 'center', left: 25,
                                            height: 20, justifyContent: 'center', borderColor: 'green'}}>
                                        <Text style={{color: 'white'}}>5</Text>
                                    </Button>
                                    
                                </View>

                                <View style={{flexDirection: 'row'}}>
                                    <Button rounded bordered
                                        style={{width: 30,backgroundColor: 'white',
                                            height: 30, justifyContent: 'center', borderColor: 'green'}}>
                                        <Image source={require('../../../assets/images/search_1.png')} style={{width: 15, height: 15}}/>
                                    </Button>  
                                    <Text style={{fontSize: 13, paddingLeft: 5, marginTop: 3}}>Quirro ir al cine con alguien</Text>
                                </View>
                                <Text style={{fontSize: 10, fontWeight: 'bold', left: 150}}>12PM</Text>
                            </CardItem>
                            
                        </Card>

                        {/* fourth card */}

                        <Card style={{borderRadius: 30/2, borderColor: 'green', flexDirection: 'row', padding: 5}}>
                            <CardItem cardBody bordered style={{flexDirection: 'row', justifyContent: 'center', margin: 3}}>
                                    <Image source={{uri: 'https://randomuser.me/api/portraits/women/83.jpg'}}
                                        style={{width: 70, height: 70, borderRadius: 80/ 2}}/>
                            </CardItem>
                            <CardItem style={{flexDirection: 'column', alignItems: 'flex-start', margin: 3}}>
                                <Text style={{fontSize: 16, fontWeight:'bold'}}>Daniela, 27</Text>
                                <Text style={{fontSize: 14, marginLeft: 5}}>Hey man?</Text>


                                <View style={{flexDirection: 'row'}}>
                                    <View // we will animate the opacity of the dots later, so use Animated.View instead of View here
                                        style={{height: 1, width: 150, backgroundColor: '#202020', margin: 5, 
                                        borderRadius: 10, marginTop: 8}}
                                        />
                                    <Button rounded bordered
                                        style={{width: 20,backgroundColor: 'blue', alignItems: 'center', left: 25,
                                            height: 20, justifyContent: 'center', borderColor: 'green'}}>
                                        <Text style={{color: 'white'}}>2</Text>
                                    </Button>
                                    
                                </View>

                                <View style={{flexDirection: 'row'}}>
                                    <Button rounded bordered
                                        style={{width: 30,backgroundColor: 'white',
                                            height: 30, justifyContent: 'center', borderColor: 'green'}}>
                                        <Image source={require('../../../assets/images/search_1.png')} style={{width: 15, height: 15}}/>
                                    </Button>  
                                    <Text style={{fontSize: 13, paddingLeft: 5, marginTop: 3}}>Quirro ir al cine con alguien</Text>
                                </View>
                                <Text style={{fontSize: 10, fontWeight: 'bold', left: 150}}>12PM</Text>
                            </CardItem>
                            
                        </Card>

                        {/* fifth card */}


                        <Card style={{borderRadius: 30/2, borderColor: 'green', flexDirection: 'row', padding: 5, marginBottom: 30}}>
                            <CardItem cardBody bordered style={{flexDirection: 'row', justifyContent: 'center', margin: 3}}>
                                    <Image source={{uri: 'https://randomuser.me/api/portraits/women/88.jpg'}}
                                        style={{width: 70, height: 70, borderRadius: 80/ 2}}/>
                            </CardItem>
                            <CardItem style={{flexDirection: 'column', alignItems: 'flex-start', margin: 3}}>
                                <Text style={{fontSize: 16, fontWeight:'bold'}}>Daniela, 27</Text>
                                <Text style={{fontSize: 14, marginLeft: 5}}>Hey man?</Text>


                                <View style={{flexDirection: 'row'}}>
                                    <View // we will animate the opacity of the dots later, so use Animated.View instead of View here
                                        style={{height: 1, width: 150, backgroundColor: '#202020', margin: 5, 
                                        borderRadius: 10, marginTop: 8}}
                                        />
                                    <Button rounded bordered
                                        style={{width: 20,backgroundColor: 'blue', alignItems: 'center', left: 25,
                                            height: 20, justifyContent: 'center', borderColor: 'green'}}>
                                        <Text style={{color: 'white'}}>1</Text>
                                    </Button>
                                    
                                </View>

                                <View style={{flexDirection: 'row'}}>
                                    <Button rounded bordered
                                        style={{width: 30,backgroundColor: 'white',
                                            height: 30, justifyContent: 'center', borderColor: 'green'}}>
                                        <Image source={require('../../../assets/images/search_1.png')} style={{width: 15, height: 15}}/>
                                    </Button>  
                                    <Text style={{fontSize: 13, paddingLeft: 5, marginTop: 3}}>Quirro ir al cine con alguien</Text>
                                </View>
                                <Text style={{fontSize: 10, fontWeight: 'bold', left: 150}}>12PM</Text>
                            </CardItem>
                            
                        </Card>

                    </View>
                  
                    </ScrollView>
                  
            </View>
        );
    }
}


const styles = StyleSheet.create({
    containerChat: {
        backgroundColor: '#202020',
        padding: 10,
        paddingBottom: 20
    },
    chatNavBar: {
        flexDirection: 'row',
        height: 60
    }
});