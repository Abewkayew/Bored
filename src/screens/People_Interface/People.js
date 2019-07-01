import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Firebase from '../../../utils/Config';

import ImageOverlay from "react-native-image-overlay";
import {photos} from '../../../utils/assets';

import Geolocation from 'react-native-geolocation-service';

const { width } = Dimensions.get('window');

export default class People extends Component{
    
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            loading: false,
            people: [],
            actName: ''
        }


      }

    componentDidMount() {
        const actName = this.props.navigation.state.params.activityName 

        const activityDatabaseReference = Firebase.database().ref().child('activities/' + actName + '/users');
        
        this.setState({loading: true, actName: actName})
     
        activityDatabaseReference.on('value', (snapshot) => {
            let data = snapshot.val();
            if(data){                    
                let peopleData = Object.values(data)
                let peopleKey = Object.keys(data)
                
                this.setState({
                    people: peopleKey,
                    loading: false
                })
            }
         });
    }

    displayPeopleData = () => {
        const userDatabaseReference = Firebase.database().ref().child('users');
        const peopleKey = this.state.people
        alert("PeopleKey : " + peopleKey)
        peopleKey.map(dataKey => {
            alert("Data Key: " + dataKey)
            userDatabaseReference.child(dataKey).once("value").then(data => {
                var key = data.key
                alert("Datas are: ")
            })
                
              
        })        
        // this.state.loading ? (alert('Loading...')) : (
        //     this.state.people.map((peopleKey, index) => {
        //         alert('People: ' + peopleKey.nombre + ' Index: ' + index)
        //     })
        // )
    }





    render(){
        // position will be a value between 0 and photos.length - 1 assuming you don't scroll pass the ends of the ScrollView
        let position = Animated.divide(this.scrollX, width);
        const people = this.state.people
        {
            this.displayPeopleData
        }
        // const loadPeopleData = this.state.loading ? (
        //             <Spinner color="red"/>
        //                 ) : (
        //                     <View>
        //                         {
        //                             this.state.people.map((peopleData, index) => {
        //                                 <Text style={{color: 'white', backgroundColor: 'red'}}>
        //                                     {
        //                                         peopleData.nombre
        //                                     }            
        //                                 </Text>           
        //                             })
        //                         }
        //                     </View>    
        //             )

        
        const {actName} = this.state.actName

        return(
            <View style={styles.containerPeople}>
                
                    <View style={styles.peopleNavBar}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Activity')}>
                            <Icon name="arrow-left" color="white" size={30}/>
                        </TouchableHighlight>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold', right: 30}}>i
                            <Text style={{color: 'white', fontSize: 20, textDecorationLine: 'underline',
                               fontWeight: 'bold', paddingBottom: 10}}>No te aburras</Text>!
                        </Text>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('ChatContainer')}>
                            <Icon name="message-text" style={{fontSize: 30, color: 'white'}}/>
                        </TouchableHighlight>
                    </View>
                    <ScrollView>
                        <View style={styles.tabViewStyle}>
                            <TouchableHighlight>
                                <Button  onPress={() => this.props.navigation.navigate('People', {activityName: 'Drink'})} 
                                        bordered light style={{width: 150, justifyContent: 'center'}}>
                                    <Text style={{color: 'white'}}>personas</Text>
                                </Button>
                            </TouchableHighlight>

                            <TouchableHighlight>
                                <Button  onPress={() => this.props.navigation.navigate('Invitation', {actName: this.state.actName})}
                                        bordered light style={{width: 150, justifyContent: 'center'}}>
                                    <Text style={{color: 'white'}}>invitaciones</Text>
                                </Button>
                            </TouchableHighlight>

                        </View>

                        {/* Just for checking the Image Horizontal Scroller...*/}


                        {
                              this.state.loading ? (
                                  <View style={{padding: 60}}>
                                      <Spinner color="red"/>
                                  </View>

                              ) : (
                                people.map((data, index) => {
                                    return(
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#fff'}}>
                                    <View
                                    // this will bound the size of the ScrollView to be a square because
                                    // by default, it will expand regardless if it has a flex value or not
                                    style={{ width, height: width}}
                                    >
                                        <Text style={{color: 'white', backgroundColor: 'green'}}>{data}</Text>
                                    
                                    <ScrollView
                                        horizontal={true}
                                        pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
                                        showsHorizontalScrollIndicator={false}
                                        // the onScroll prop will pass a nativeEvent object to a function
                                        onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
                                        [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
                                        )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
                                        scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
                                        >
                                        {photos.map((source, i) => { // for every object in the photos array...
                                        return ( // ... we will return a square Image with the corresponding object as the source
                                          <TouchableHighlight onPress={() => this.props.navigation.navigate('Profile')}>
                                                <ImageOverlay
                                                    key={i}
                                                    source={source}
                                                    style={{width, height: width}}
                                                    overlay='cyan'
                                                    contentPosition='bottom'>
                                                        {/* <TouchableHighlight onPress={() => alert('Message works')}> */}
                                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                                            <Button rounded bordered onPress={() => this.props.navigation.navigate('SingleChat')}
                                                                style={{width: 50,backgroundColor: '#fff',
                                                                    height: 50, justifyContent: 'center', borderColor: 'green'}}>
                                                                <Image source={require('../../../assets/images/messages.png')} style={{width: 30, height: 30}}/>
                                                            </Button>
                                                        </View>
                                                              
                                                        {/* </TouchableHighlight> */}
                                                 </ImageOverlay>  
                                           </TouchableHighlight>
                                        );
                                        })}
                                    </ScrollView>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 5}}>
                                                <Text style={{fontSize: 20, fontWeight:'bold'}}>Daniela, 27</Text>
                                                <Image source={require('../../../assets/images/camera_1.png')} 
                                                  style={{width: 30, height: 30, marginLeft: 60}}/>
                                                <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 5}}>3</Text>
                                            </View>
                                    </View>
                                    
                            </View>
                                
                                    )
                                }
                            )
                              )
                        }



                        {/* End of the Image Scroll Example */}

                    </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerPeople: {
        flex: 1,
        backgroundColor: '#202020',
        padding: 10
    },
    peopleNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60
    },
    tabViewStyle: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'space-between'
    },
    peopleImageStyle: {
        backgroundColor: 'white',
        marginTop: 20
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