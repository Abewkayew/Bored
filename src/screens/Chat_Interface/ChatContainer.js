import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated, TouchableOpacity} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Firebase from '../../../utils/Config';

const { width } = Dimensions.get('window');
export default class ChatContainer extends Component{
 
    constructor(props){
        super(props)
        this.state = {
            people: [],
            loading: false
        }

        this.dbRef = Firebase.database().ref()
        
    }
    
    componentDidMount(){
        const {currentUser} = Firebase.auth();
        const userMessages = this.dbRef.child('messages/' + currentUser.uid)
        const userDatabaseReference = this.dbRef.child('users');
        
        let that = this

        userMessages.once('value', snapShot => {
            let userKeys = []
            snapShot.forEach(data => {
                let personKey = {
                    id: data.key
                }
                userKeys.push(personKey)
                
                // begining


                if(userKeys.length < 1){
                    that.setState({loading: false})
                }else{
                // Display People Data here 
                   const peopleArray = []    
                    for (var i = 0; i < userKeys.length; i++){
                        // const userID = userKeys[i].id
                        const userKey = userDatabaseReference.child(userKeys[i].id).key
                        const userDbRef = userDatabaseReference.child(userKeys[i].id)
                        const userKeyMessage = userMessages.child(userKeys[i].id)
                        const messages = userKeyMessage.limitToLast(1)

                        let messageText = ''
                        let totalMessages = 0

                        const usersDBPath = this.dbRef.child('users/' + userKey)
                        const profilePath = usersDBPath.child('ProfileImages')
                        let profileImagePath = profilePath.limitToLast(1)

                        messages.once('value', snapShot => {
                            const mData = snapShot.val()
                            const messageData = mData.message
                            
                            messageText = messageData
                            
                            
                            snapShot.forEach(messageData => {
                                let messageKey = messageData.key
                                let mMessages = userKeyMessage.child(messageKey)
                               
                                mMessages.once('value', dbSnapshot => {
                                    const mData = dbSnapshot.val()
                                    const messageData = mData.message
                                    const time = Number(mData.time)
                                    messageText = messageData
                                    var date = new Date(time*1000)
                                    // Hours part from the timestamp
                                    var hours = date.getHours();
                                    // Minutes part from the timestamp
                                    var minutes = "0" + date.getMinutes();
                                    // Seconds part from the timestamp
                                    var seconds = "0" + date.getSeconds();
                                    var AM_PM = "AM"
                                    hours = hours - 5 // Change hour to Peru time standard (GMT - 5)
                                    if (hours >= 12) {
                                        hours = hours - 12;
                                        AM_PM = "PM";
                                      }
                                      if (hours == 0) {
                                        hours = 12;
                                      }
                                      minutes = minutes < 10 ? "0" + minutes : minutes;

                                    // Will display time in 10:30:23 format
                                    var formattedTime = hours + ':' + minutes.substr(-2) + " " + AM_PM;

                                    userDbRef.on("value", (snapShot) => {
                                        let data = snapShot.val()
                                        
                                        userKeyMessage.once('value', dbSp => {
                                            let numberOfMessages = dbSp.numChildren()
                                            totalMessages = numberOfMessages

                                            // check if the current user id exists inside the from messages node.
                                            userKeyMessage.once('value', dts => {
                                                dts.forEach(messageData => {
                                                    var obj = messageData.val()
                                                    var messageFrom = obj.from
                                                    var isMessageSeen = obj.seen

                                                    if(messageFrom == currentUser.uid){
                                                        totalMessages = totalMessages - 1
                                                    }
                                                })
                                                // 
                                                profileImagePath.once('value', dbSp => {
                                                    const profileData = dbSp.val()
                                                    var imageUrl = ''
                                                    dbSp.forEach(dt => {
                                                        var keyDt = dt.key
                                                        profilePath.child(keyDt).once('value', dtSnapshot => {
                                                            let valImage = dtSnapshot.val()
                                                            imageUrl = valImage.profileImageUrl
                                                        })
                                                    })

                                                    let personObject = {
                                                        nombre: data.nombre,
                                                        phone: data.phone,
                                                        userId: userKey,
                                                        message: messageText,
                                                        time: formattedTime,
                                                        totalCount: totalMessages,
                                                        profileImage: imageUrl
                                                    }                             
                                                    peopleArray.push(personObject)
                                                    that.setState({
                                                        people: peopleArray,
                                                        loading: false
                                                    })
                                                })
                                            })    
                                        })
                                     }
                                   )
                               })
                           })
                       })
                    }
                }   
            })
        })
    }

    componentWillUnmount() {
        this.dbRef.off()
    }


    render(){

        const {people} = this.state
        return(
            <View style={styles.containerChat}>

                    <View style={styles.chatNavBar}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableHighlight onPress={() => this.props.navigation.navigate('Activity')}>
                                <Icon name="arrow-back" color="#000" size={30}/>
                            </TouchableHighlight>
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold', left: 30}}>
                                <Text style={{color: '#000', fontSize: 25, fontWeight: 'bold', paddingBottom: 10}}>Messages</Text>
                            </Text>
                        </View>
                        <Icon name="search" size={35}/>
                    </View>
                    <ScrollView>

                        {
                            people.map((data, index) => {
                                return(
                                    <View style={{marginTop: 20, marginBottom: 20}}>

                                       <TouchableHighlight
                                            onPress={() => this.props.navigation.navigate('SingleChat', {user: data.userId})}>
                                        <View style={{flexDirection:'row'}}>
                                            <View>
                                                <Image source={{uri: data.profileImage}}
                                                style={{width: 70, height: 70, borderRadius: 80/ 2, borderColor: '#4DDFE5'}}/>
                                            </View>
                                            <View style={{marginLeft: 20}}>

                                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                                                    <View>
                                                        <Text style={{fontSize: 16, fontWeight:'bold', marginBottom: 10}}>{data.nombre}</Text>
                                                        <Text style={{fontSize: 15}}>{data.message}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={{marginBottom: 10}}>{data.time}</Text>
                                                        <Button rounded bordered
                                                            style={{width: 20,backgroundColor: '#4DDFE5', alignItems: 'center',
                                                                height: 20, justifyContent: 'center' }}>
                                                            <Text style={{color: 'white'}}>{data.totalCount}</Text>
                                                        </Button>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection: 'row'}}>
                                                    <Button rounded bordered
                                                        style={{width: 30,backgroundColor: 'white',
                                                            height: 30, justifyContent: 'center', borderColor: 'green'}}>
                                                        <Image source={require('../../../assets/images/search_1.png')} style={{width: 15, height: 15}}/>
                                                    </Button>
                                                    <Text style={{fontSize: 13, paddingLeft: 5, marginTop: 3}}>You met in the activity Movies</Text>
                                                </View>
                                            </View>
                                        </View> 
                                           
                                       </TouchableHighlight>     

                                        <View style={{marginTop: 10,height: 1, backgroundColor: '#f5f5ef'}}></View>
                                    </View>

                                    

                                )
                            })
                        }

                    <View style={{paddingBottom: 20}}>

                        
                        {/* second card */}
                        
                        <Card style={{flexDirection: 'row', padding: 5}}>
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
                                        style={{width: 20,backgroundColor: '#4DDFE5', alignItems: 'center', left: 100,
                                            height: 20, justifyContent: 'center' }}>
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

                        
                    </View>
                  
                    </ScrollView>
                  
            </View>
        );
    }
}


const styles = StyleSheet.create({
    containerChat: {
        backgroundColor: '#fff',
        padding: 10,
        paddingBottom: 20
    },
    chatNavBar: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-between'
    }
});