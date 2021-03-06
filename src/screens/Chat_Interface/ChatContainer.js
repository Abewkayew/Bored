import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import {Card, CardItem, Button, Spinner } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Firebase from '../../../utils/Config'

const { width } = Dimensions.get('window')

export default class ChatContainer extends Component{
 
    constructor(props){
        super(props)
        this.state = {
            people: [],
            loading: false,
            currentUser: null,
            noChatsYet: false,
            messageSeen: false
        }

        this.dbRef = Firebase.database().ref()
        
    }
    
    handleOK = () => {
        alert("Everything is working fine.")
    }

    componentDidMount(){
        const {currentUser} = Firebase.auth()
        

        const userMessages = this.dbRef.child('messages/' + currentUser.uid)
        const userDatabaseReference = this.dbRef.child('users');
        
        let that = this

        that.setState({
            currentUser: currentUser.uid,
            loading: true
        })

        userMessages.once('value', snapShot => {
            const messagesExist = snapShot.exists()
            
            if(messagesExist){
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
    
                                snapShot.forEach(messageData => {
                                    let messageKey = messageData.key
                                    const messData = messageData.val()
                                    const userMessageFrom = messData.from
                                    if(userMessageFrom === currentUser.uid){
                                        that.setState({
                                            messageSeen: true
                                        })
                                    }

                                    let mMessages = userKeyMessage.child(messageKey)
                                    mMessages.once('value', dbSnapshot => {
                                        const mData = dbSnapshot.val()
                                        const messageData = mData.message
                                        const time = Number(mData.time)
                                        const activityMet = mData.activityMet
                                        // const messageFrom = mData.from
    
                                        const messageContent = messageData.substr(0, 20)
                                        messageText = messageContent
                                        if(messageContent.length > 15){
                                            messageText = messageContent + '...'
                                        }
    
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
    
                                        if(hours < 0 ){
                                            hours = -1 * hours
                                        }
                                        // Will display time in 10:30:23 format
                                        var formattedTime = hours + ':' + minutes.substr(-2) + " " + AM_PM;
                                        
                                        userDbRef.on("value", (snapShot) => {
                                            let data = snapShot.val()
                                            userKeyMessage.once('value', dbSp => {
                                                let numberOfMessages = dbSp.numChildren()
                                                totalMessages = numberOfMessages
    
                                                // check if the current user id exists inside the from messages node.
                                                userKeyMessage.once('value', dts => {
                                                    var userIsGuest = true
                                                    var messageFrom = ''
                                                    dts.forEach(messageData => {
                                                        var obj = messageData.val()
                                                        messageFrom = obj.from
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
    
                                                        if(messageFrom === currentUser.uid){
                                                            userIsGuest = false
                                                        }
    
                                                        let personObject = {
                                                            nombre: data.nombre,
                                                            phone: data.phone,
                                                            userId: userKey,
                                                            message: messageText,
                                                            time: formattedTime,
                                                            totalCount: totalMessages,
                                                            profileImage: imageUrl,
                                                            activityMet: activityMet,
                                                            userIsGuest: userIsGuest
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
            }else{
              that.setState({
                  noChatsYet: true,
                  loading: false
              })
            }
        })
    }

    componentWillUnmount() {
        this.dbRef.off()
    }


    render(){

        const {people, loading, noChatsYet, messageSeen} = this.state
        return(
            <View style={styles.containerChat}>

                    <View style={styles.chatNavBar}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Activity')}>
                                <Icon name="arrow-back" color="#000" size={30}/>
                            </TouchableOpacity>
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold', left: 30}}>
                                <Text style={{color: '#000', fontSize: 25, fontWeight: 'bold', paddingBottom: 10}}>Messages</Text>
                            </Text>
                        </View>
                        <Icon name="search" size={35}/>
                    </View>
                    <ScrollView
                     showsVerticalScrollIndicator={false}>

                      {
                          loading ? (
                                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 50}}>
                                    <Spinner color="#21CEFF"/>
                                </View>
                          ) : (
                              noChatsYet ? (
                                  <View style={{justifyContent: 'center', alignItems: 'center', justifyContent: 'center', marginVertical: 80}}>
                                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>There are no chats yet</Text>
                                  </View>
                              ): (
                                <View>
                                {
                                    people.map((data, index) => {
                                        return(
                                            <View style={{marginTop: 20, marginBottom: 20}}>
                                                {
                                                   data.userIsGuest ? (
                                                    <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    onPress={() => this.props.navigation.navigate('SingleChat',
                                                         {user: data.userId,    
                                                          actName: data.activityMet})}>
                                                    <View style={{flexDirection:'row'}}>
                                                        <View>
                                                            <Image source={{uri: data.profileImage}}
                                                            style={{width: 70, height: 70, borderRadius: 80/ 2, borderColor: '#4DDFE5'}}/>
                                                        </View>
                                                        <View style={{marginLeft: 20}}>
                                                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                                                                <View>
                                                                    <Text style={{fontSize: 16, fontWeight:'bold', marginBottom: 10}}>{data.nombre}</Text>
                                                                    <View style={{flexDirection: 'row'}}>
                                                                        <Button rounded bordered
                                                                            onPress={() => this.props.navigation.navigate('SingleChat',
                                                                            {user: data.userId,    
                                                                             actName: data.activityMet})}
                                                                            style={{width: 40,backgroundColor: 'white',
                                                                                height: 40, justifyContent: 'center'}}>
                                                                            <Icon name="check-circle" size={30} color="#106e3d"/>
                                                                        </Button> 
                                                                        <Button rounded bordered elevation={5}
                                                                            style={{width: 40,backgroundColor: 'white',left: 20,
                                                                                height: 40, justifyContent: 'center'}}>
                                                                             <Icon name="cancel" color="red" type="feather" style={{fontSize: 30}}/>
                                                                        </Button>
                                                                    </View>
                                                                </View>
                                                                <View>
                                                                    <Text style={{marginBottom: 10, alignSelf: 'flex-end'}}>{data.time}</Text>
                                                                    {
                                                                        data.totalCount != 0 ? (
                                                                            <Button rounded bordered
                                                                                style={{width: 20,backgroundColor: '#4DDFE5', alignItems: 'center',
                                                                                    height: 20, justifyContent: 'center' }}>
                                                                                <Text style={{color: 'white'}}>{data.totalCount}</Text>
                                                                            </Button>
                                                                        ) : (
                                                                            <Text style={{color: 'white'}}>''</Text>
                                                                        )
                                                                    }
                                                                </View>
                                                            </View>
                                                            <View style={{flexDirection: 'row'}}>
                                                                <Button rounded bordered
                                                                    style={{width: 30,backgroundColor: 'white',
                                                                        height: 30, justifyContent: 'center', borderColor: 'green'}}>
                                                                    <Image source={require('../../../assets/images/search_1.png')} style={{width: 15, height: 15}}/>
                                                                </Button>
                                                                <Text style={{fontSize: 13, paddingLeft: 5, marginTop: 3}}>You met in the activity {data.activityMet}</Text>
                                                            </View>
                                                        </View>
                                                    </View> 
                                                    
                                                </TouchableOpacity>     
                                                  ): (
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        onPress={() => this.props.navigation.navigate('SingleChat',
                                                            {user: data.userId, actName: data.activityMet})}>
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
                                                                        <Text style={{marginBottom: 10, alignSelf: 'flex-end'}}>{data.time}</Text>
                                                                        {
                                                                            (data.totalCount != 0) && (!messageSeen) ? (
                                                                                <Button rounded bordered
                                                                                    style={{width: 20,backgroundColor: '#4DDFE5', alignItems: 'center',
                                                                                        height: 20, justifyContent: 'center' }}>
                                                                                    <Text style={{color: 'white'}}>{data.totalCount}</Text>
                                                                                </Button>
                                                                            ) : (
                                                                                <Text style={{color: 'white'}}>''</Text>
                                                                            )
                                                                        }
                                                                    </View>
                                                                </View>
                                                                <View style={{flexDirection: 'row'}}>
                                                                    <Button rounded bordered
                                                                        style={{width: 30,backgroundColor: 'white',
                                                                            height: 30, justifyContent: 'center', borderColor: 'green'}}>
                                                                        <Image source={require('../../../assets/images/search_1.png')} style={{width: 15, height: 15}}/>
                                                                    </Button>
                                                                    <Text style={{fontSize: 13, paddingLeft: 5, marginTop: 3}}>You met in the activity {data.activityMet}</Text>
                                                                </View>
                                                            </View>
                                                        </View> 
                                                        
                                                    </TouchableOpacity>     
                                                 )                                                    
                                                }
                                                <View style={{marginTop: 10,height: 1, backgroundColor: '#f5f5ef'}}></View>
                                            </View>
        
                                            
        
                                        )
                                    })
                                }

                            </View>
                              )
                         

                          )
                      }  
  
                    </ScrollView>
                  
            </View>
        );
    }
}


const styles = StyleSheet.create({
    containerChat: {
        backgroundColor: '#fff',
        padding: 10,
        paddingBottom: 40
    },
    chatNavBar: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-between'
    }
})