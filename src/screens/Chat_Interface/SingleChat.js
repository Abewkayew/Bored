import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, 
        Animated, TextInput, TouchableOpacity, FlatList} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';

import Icon from 'react-native-vector-icons/MaterialIcons'

import Firebase from '../../../utils/Config';
import firebase from 'firebase'


import ImageOverlay from "react-native-image-overlay";

const { width, height } = Dimensions.get('window');


export default class SingleChat extends Component{
    constructor(props){
        super(props)
        
        this.state = {
            txtMessage: '',
            currentUserID: null,
            messagesList: [],
            userData: {}
        }
 
        this.actName = this.props.navigation.state.params.actName 
        this.anotherUserId = this.props.navigation.state.params.user
    }

    handleTextMessage = (textMessage) => {
        this.setState({
            txtMessage: textMessage
        })   
    }

    submitMessage = () => {
        if(this.state.txtMessage.length > 0){
             let messageID = Firebase.database().ref('messages').child(this.state.currentUserID).child(this.anotherUserId).push().key
             let chatID = Firebase.database().ref('chats').child(this.anotherUserId).child(this.state.currentUserID).push().key
                
            
             
             let updates = {}

             let message = {
                 message: this.state.txtMessage,
                 time: firebase.database.ServerValue.TIMESTAMP,
                 from: this.state.currentUserID,
                 messageId: messageID,
                 seen: false
             }

             let chat = {
                 seen: false,
                 time: message.time
             }

             updates['messages/' + this.state.currentUserID + '/' + this.anotherUserId + "/" + messageID] = message
             updates['messages/' + this.anotherUserId + '/' + this.state.currentUserID + "/" + messageID] = message
             updates['chats/' + this.anotherUserId + '/' + this.state.currentUserID + '/' + chatID]= chat

             Firebase.database().ref().update(updates).then(() => {
                 this.setState({txtMessage: ''})
             }).catch((error) => {
                 console.log(error)
             })

           }else{
                return
           }
    }

    
    componentDidMount(){
        const {currentUser} = Firebase.auth();
        this.setState({
            currentUserID: currentUser.uid
        })
        let that = this
        Firebase.database().ref('users').child(this.anotherUserId).once('value', dataSnapshot => {
            let data = dataSnapshot.val()
            that.setState({userData: data})
        })

        Firebase.database().ref('messages').child(currentUser.uid).child(this.anotherUserId)
        .on('child_added', (value) => {
            that.setState((prevState) => {
                return {
                    messagesList: [...prevState.messagesList, value.val()]
                }
            })
        })

    }


    renderRow = ({item}) => {
        return(
             <View style={{paddingTop: 10}}>
                <TouchableOpacity onPress={() => this.itemPressedHandler(item.messageId)}>
                    <View style={{
                        flexDirection: 'row',
                        width: '95%',
                        alignSelf: item.from === this.state.currentUserID ? 'flex-end' : 'flex-start',
                        justifyContent: item.from === this.state.currentUserID ? 'flex-end' : 'flex-start',
                        }}>
                        { item.from != this.state.currentUserID ? (
                            <Image source={{uri: this.state.userData.profileImageUrl}}
                                        style={{width: 50, height: 50, borderRadius: 80/ 2}}/>
                            ) : (
                                <Text></Text>
                            )
                        }
                        <View style={{
                            width: '70%',
                            borderRadius: 20,
                            marginBottom: 15,
                            marginLeft: 10,
                            backgroundColor: item.from === this.state.currentUserID ? '#fff' : '#4DDFE5',
                            borderBottomColor: '#EBEEEE'
                            }}
                            elevation={5}
                            >
                            
                           <Text style={
                                {color: item.from === this.state.currentUserID ? '#000' : '#fff',
                                    padding: 10, fontSize: 16}
                                }>{item.message}</Text>
                            {/* <Text style={{color: '#eee', padding: 3, fontSize: 12}}>{item.time}</Text> */}
                    </View>
                    </View>
                    
                </TouchableOpacity>
             </View>
                
        )

    }


    itemPressedHandler = (messageID) => {
        let myMessage = Firebase.database().ref('messages').child(this.state.currentUserID).child(this.anotherUserId)
        let anotherUserMessage = Firebase.database().ref('messages').child(this.anotherUserId).child(this.state.currentUserID)
        
        myMessage.child(messageID).remove()
        anotherUserMessage.child(messageID).remove()


    }

    render(){
        const {userData} = this.state

        return(
            <View style={styles.containerSingleChat}>
                    <View style={styles.singleChatNavBar} elevation={1}>
                        <View style={styles.containLeftSideUserDetail}>
                            <TouchableHighlight onPress={() => this.props.navigation.navigate('People', {activityName: this.actName})}>
                                <Icon name="arrow-back" size={40}/>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => this.props.navigation.navigate('Profile', {actName: this.actName})}>
                                <Image source={{uri: userData.profileImageUrl }}
                                    style={{width: 50, height: 50, borderRadius: 80/ 2, left: 20}}/>
                            </TouchableHighlight>
                            <View style={styles.navBarUserDetail}>
                                <Text style={styles.nameStyle}>{userData.nombre}, 27</Text>
                                <View style={styles.userStatus}>
                                    <Text style={styles.statusOfflineOrActive}>Active</Text>
                                    <Image
                                        source={require('../../../assets/images/user_online_1.png')} 
                                        style={{height: 15, width: 15, margin: 5}}
                                    />
                                </View>    
                            </View>
                        </View>
                        <View style={styles.optionsMenu}>
                            <Icon name="more-vert" size={35}/>
                        </View>
                    </View>
                    <ScrollView>
                        <View style={styles.chatMessagesContainer}>
                                <ScrollView horizontal={true}>
                                    <FlatList
                                    style={{padding: 10, height: height*0.8}}
                                    data={this.state.messagesList}
                                    renderItem={this.renderRow}
                                    keyExtractor={(item, index) => index.toString()}
                                    />
                                </ScrollView>
                        </View>
                        <View style={styles.inputView}>
                            <Icon name="camera-alt" color="#4DDFE5"  size={35}/>
                            <Icon name="insert-photo" color="#4DDFE5"  size={35}/>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={this.state.txtMessage}
                                    placeholder="Type your message"
                                    autoCapitalize={false}
                                    multiline={true}
                                    onChangeText={this.handleTextMessage}
                                />
                            </View>
                            <TouchableOpacity onPress={this.submitMessage}>
                                <Icon name="send" color="#4DDFE5"  size={30} />
                            </TouchableOpacity>
                            <Icon name="mood"  color="#4DDFE5" size={35}/>
                        </View>
                    </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerSingleChat: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10
    },
    singleChatNavBar: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        height: 60,
    },
    containLeftSideUserDetail: {
        flexDirection: 'row'
    },
    navBarUserDetail: {
        flexDirection: 'column',
        fontSize: 20,
        left: 30
    },  
    nameStyle: {
        fontSize: 18,
        fontWeight: 'bold'
    },  
    userStatus: {
        flexDirection: 'row'
    },
    statusOfflineOrActive: {
        fontSize: 16,
        color: '#736b6b'
    },
    chatMessagesContainer: {
         padding: 10,
         height: '75%',
    },
    inputView: {
        height: '25%',
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'center',
        marginBottom: 10
    },
    inputContainer: {
        borderRadius: 25,
        borderColor: '#4DDFE5',
        borderWidth: 2,
        flexWrap: 'wrap',
        height: '30%',
        width: '60%'
    },  
    optionsMenu: {
        paddingRight: 10
    }

});