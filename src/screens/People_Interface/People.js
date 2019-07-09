import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Firebase from '../../../utils/Config';

import ImageOverlay from "react-native-image-overlay";
import {photos} from '../../../utils/assets';

const { width } = Dimensions.get('window');

export default class People extends Component{
    
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            loading: false,
            people: [],
            peopleLength: 0,
            photos: [],
            currentUser: null,
            noPeople: false
         }
         this.actName = this.props.navigation.state.params.activityName 
        
      }
    
    // shouldComponentUpdate(nextProps, nextState){
    //     return nextProps.people != this.state.people
    // }

    componentDidMount() {
        const that = this;
        const {currentUser} = Firebase.auth();
        this.setState({currentUser: currentUser.uid})
        const activityDatabaseReference = Firebase.database().ref().child('activities/' + this.actName + '/users');
        const userDatabaseReference = Firebase.database().ref().child('users');
        
        // start listening to Firebase Database
        this.setState({loading: true})
       

        activityDatabaseReference.on('value', (snapshot) => {
            let peoples = [];
            snapshot.forEach(data => {
                let person = {
                    id: data.key
                }

                if(person.id != currentUser.uid){
                    peoples.push(person)
                }

            if(peoples.length < 1){
                that.setState({loading: false, noPeople: true})
            }else{
            // Display People Data here 
            const peopleArray = []    
                for (var i = 0; i < peoples.length; i++){
                    userDatabaseReference.child(peoples[i].id).on("value", (snapShot) => {
                        let data = snapShot.val()
                        let personObject = {
                            nombre: data.nombre,
                            phone: data.phone,
                            profileImageUrl: data.profileImageUrl
                        }  
                                
                        peopleArray.push(personObject)
                        that.setState({
                            people: peopleArray,
                            loading: false
                        })
                        }
                    )
                    // }
                }
            }

            
                    
         });
       
    })
   }



    render(){
        // position will be a value between 0 and photos.length - 1 assuming you don't scroll pass the ends of the ScrollView
        let position = Animated.divide(this.scrollX, width);
        
        const {people, loading, noPeople} = this.state
        
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
                                <Button  onPress={() => this.props.navigation.navigate('People', {actName: this.actName})} 
                                        bordered light style={{width: 150, justifyContent: 'center'}}>
                                    <Text style={{color: 'white', fontWeight: "bold"}}>personas</Text>
                                </Button>
                            </TouchableHighlight>
                            <TouchableHighlight>
                                <Button  onPress={() => this.props.navigation.navigate('Invitation', {actName: this.actName})}
                                        bordered light style={{width: 150, justifyContent: 'center'}}>
                                    <Text style={{color: 'white', fontWeight: "bold"}}>invitaciones</Text>
                                </Button>
                            </TouchableHighlight>

                        </View>

                        {/* Just for checking the Image Horizontal Scroller...*/}


                        {
                              loading ? (
                                  <View style={{padding: 60}}>
                                      <Text style={{color: 'red', fontSize: 22}}>Loading People</Text>
                                      <Spinner color="red"/>
                                  </View>

                              ) : (
                                noPeople ? (
                                    <View style={{padding: 40, flexDirection: 'row'}}>
                                        <Text style={{color: 'red', fontSize: 22}}> No one in {this.actName} activity</Text>
                                    </View>
                                ): (
                                    people.map((data, index) => {
                                        return(
                                            <View>
                                               <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#fff'}}>
                                                    <TouchableHighlight onPress={() => this.props.navigation.navigate('Profile', {actName: this.actName})}>
                                                        <Image
                                                            source={{uri: `${data.profileImageUrl}`}}
                                                            style={{width: width, height: 300}}
                                                            />
                                                    </TouchableHighlight>
                                                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 5}}>
                                                        <Text style={{fontSize: 20, fontWeight:'bold'}}>{data.nombre}, 27</Text>
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