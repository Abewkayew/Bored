import React, {Component} from 'react'
import {StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { Spinner, Button } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Firebase from '../../../utils/Config'

export default class SendInvitation extends Component{
 
    constructor(props){
        super(props)
        this.state = {
            people: [],
            loading: false,
            currentUser: null,
            noChatsYet: false,
            selectChat: false
        }

        this.dbRef = Firebase.database().ref()
                
        this.promotionUrl = this.props.navigation.state.params.promotionUrl
        this.text = this.props.navigation.state.params.text

    }
    
    handleSelect = (userId, activityName) => {
        this.setState({
            selectChat: true
        })
        // this.props.navigation.navigate('SingleChat', {user: userId, actName: activityName})
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
        
        const {people, loading, noChatsYet, selectChat} = this.state

        const promotionUrl = this.promotionUrl
        const text = this.text
        
        return(
            <View style={styles.containerChat}>
                    <View style={styles.chatNavBar}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Activity')}>
                                <Icon name="arrow-back" color="#000" size={30}/>
                            </TouchableOpacity>
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold', left: 25}}>
                                <Text style={{color: '#000', fontSize: 25, fontWeight: 'bold', paddingBottom: 10}}>
                                    Send an Invitation
                                </Text>
                            </Text>
                        </View>
                        <Icon name="search" size={35}/>
                    </View>

                    <View style={styles.stylePromotion}>
                        <View style={styles.promoImageContainer}>
                            <Image 
                                source={{uri: promotionUrl}}
                                style={{width: 80, height: 90}}
                                />
                        </View>
                        <View style={styles.promoTextContainer}>
                            <Text style={styles.promoText}>Let's go for this movie?</Text>
                            <Text style={styles.promoText}>There's a {text} close</Text>
                        </View>
                    </View>
                    <Text 
                        style={styles.sendInvitationText}>Send Invitation To: </Text>

                    <View style={{height: 300}}>
                        <ScrollView
                        showsVerticalScrollIndicator={false}
                        >
                        {
                          loading ? (
                                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 50}}>
                                    <Spinner color="#21CEFF"/>
                                </View>
                          ) : (
                              noChatsYet ? (
                                  <View style={{justifyContent: 'center', 
                                                alignItems: 'center', justifyContent: 'center', 
                                                marginVertical: 30, marginHorizontal: 20}}>
                                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>There is no one to send invitation to. </Text>
                                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Help: </Text>
                                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>To send invitation, You must have at least one person in your chat list.</Text>
                                  </View>
                              ): (
                                <View>
                                {
                                    people.map((data, index) => {
                                        return(
                                            <View style={{marginTop: 5, marginBottom: 5}}>
                                                {
                                                   data.userIsGuest ? (
                                                    <Text></Text>  
                                                  ): (
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        style={selectChat ? styles.styleSelectActive: ''}
                                                        onPress={() => this.handleSelect(data.userId, data.activityMet)}>
                                                        <View style={{flexDirection:'row', marginHorizontal: 20}}>
                                                            <View style={{marginVertical: 10}}>
                                                                <Image source={{uri: data.profileImage}}
                                                                style={{width: 70, height: 70, borderRadius: 80/ 2, borderColor: '#4DDFE5'}}/>
                                                            </View>
                                                            <View style={{marginLeft: 20}}>
                
                                                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                                                                    <View>
                                                                        <Text style={{fontSize: 16, fontWeight:'bold', marginBottom: 10}}>{data.nombre}</Text>
                                                                        <Text style={{fontSize: 15}}>{data.message}</Text>
                                                                    </View>
                                                                    <Text style={{marginBottom: 10}}>{data.time}</Text>
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

                    <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} >
                        <Button rounded transparent info onPress={() => this.saveState()}
                            style={{backgroundColor: '#21CEFF', width: 150, justifyContent: 'center'}}>
                            <Text style={{fontSize: 18, color: '#fff',
                                fontWeight: '500', marginLeft: 5, marginRight: 10}}>
                                Submit
                            </Text>
                        </Button>
                    </TouchableOpacity>
                  
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerChat: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 100
    },
    chatNavBar: {
        flexDirection: 'row',
        height: 60,
        marginHorizontal: 20,
        justifyContent: 'space-between'
    },
    promoText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
        marginRight: 10
    },
    stylePromotion: {
        flexDirection: 'row',
        backgroundColor: '#a8a8a8',
        padding: 10,
        marginHorizontal: 20,
        overflow: 'hidden',
        borderColor: '#dddddd',
        borderRadius: 20,
        borderWidth: 1
    },

    styleSelectActive: {
        backgroundColor: '#21CEFF',
        overflow: 'hidden',
        borderColor: '#dddddd',
        borderWidth: 1 
    },
    promoTextContainer: {
        width: 200,
        paddingLeft: 15,
        marginRight: 25,
        marginVertical: 15
    },
    sendInvitationText: {
        color: '#21CEFF', 
        fontSize: 24, 
        fontWeight: 'bold', 
        alignSelf: 'center',
        marginVertical: 10
    },
    promoImageContainer: {
        overflow: 'hidden',
        borderColor: '#dddddd',
        borderRadius: 20,
        borderWidth: 1
    }
})