import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated} from 'react-native';
import { Button } from 'native-base';

import Icon from 'react-native-vector-icons/MaterialIcons';

import ImageOverlay from "react-native-image-overlay";
import Firebase from '../../../utils/Config'

import NavigationBarComponent from '../CommonScreens/NavigationBarComponent'

import {photos} from '../../../utils/assets'

const { width } = Dimensions.get('window');

export default class MyProfile extends Component{
    constructor(props){
        super(props)

        this.state = {
            name: '',
            profileImageUrl: '',
            profileImages: []
        }

        this.dbRef = Firebase.database().ref()

    }

    componentDidMount(){
        const {currentUser} = Firebase.auth();
        const usersDBPath = this.dbRef.child('users/' + currentUser.uid);
        const that = this
        usersDBPath.once('value', dataSnapshot => {
            const data = dataSnapshot.val()
            const profileUrl = data.profileImageUrl
            const userName = data.nombre
            that.setState({
                name: userName,
                profileImageUrl: profileUrl
            })
        })

    let profileImagePath = usersDBPath.child('ProfileImages')

    profileImagePath.once('value', datasnapShot => {
        const countTotal = datasnapShot.numChildren()
        let profileImage = []
        datasnapShot.forEach(data => {
            let profileImageKey = {
                id: data.key
            }
            profileImage.push(profileImageKey)

            if(profileImage.length > 0){
                const photoArray = []
                for (var i = 0; i < profileImage.length; i++){
                    profileImagePath.child(profileImage[i].id).on("value", (snapShot) => {
                        let data = snapShot.val()

                        let profileImageObject = {
                            profileImageUrl: data.profileImageUrl
                        }  
                                
                        photoArray.push(profileImageObject)
                        this.setState({
                            profileImages: photoArray,
                            loading: false
                        })
                        }
                    )
                }

            }
        })    

        this.setState({
            totalPhotos: countTotal
        })

    })





    }

    componentWillUnmount(){
        this.dbRef.off()
    }
    render(){
        
        const {profileImageUrl, name, profileImages} = this.state

        const userProfilePicture = profileImages[profileImages.length - 1]
        let profilePicture = ''
        for (var key in userProfilePicture){ 
            profilePicture = userProfilePicture[key]
        }
    
        return(
            <View style={styles.containerProfile}>
                <ScrollView>

                <View style={styles.navigationBar} elevation={20}>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('MyProfile')} style={styles.navigationItems}>
                        <Icon name="account-circle" style={{fontSize: 35, color: '#4DDFE5'}} />
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.navigationItems} onPress={() => this.props.navigation.navigate('Activity')}>
                        <Icon name="mood" style={{fontSize: 40, color: '#1f1f14'}}/>
                    </TouchableHighlight>
                    <View style={styles.navigationItems}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('ChatContainer')}>
                            <Image 
                                source={require('../../../assets/images/message_single_two.png')}
                                style={{width: 40, height: 40}}
                                />
                        </TouchableHighlight>
                        <Button  
                            rounded style={{top: -15, left: 15, backgroundColor: '#4DDFE5',
                            padding: 5, width: 20, height: 20, alignContent: 'center'}}>
                            <Text style={{color: 'white'}}>2</Text>
                        </Button>
                    </View>
                    
                </View>

                    <View style={styles.shadowStyle}></View>
                    <View style={styles.imageContainer}>
                        <View style={{ flex: 2 }}>
                            <Image source={{uri: profilePicture}}
                                style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }}
                            />
                        </View>
                    </View>
                    <View style={styles.userNameContainer}>
                        <Text style={styles.nameTextStyle}>{name}, 27</Text>    
                    </View>
                    <View style={styles.buttonsContainer}>
                        <View style={styles.singleButtonContainer}>
                            <Button onPress={() => this.props.navigation.navigate('EditProfile')}
                                rounded style={{backgroundColor: '#4DDFE5', padding: 5, width: 150, alignItems: 'center'}}>
                                <Icon name="account-circle" style={{fontSize: 24, color: '#fff', marginLeft: 10}} />
                                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 17, marginLeft: 10}}>Edit</Text>
                            </Button>
                        </View>
                        <View style={styles.singleButtonContainer}>
                            <Button rounded style={{backgroundColor: 'white', padding: 5, width: 150, alignItems: 'center'}}>
                                <Icon name="settings" style={{fontSize: 24, color:'#202020', marginLeft: 10}} />
                                <Text style={styles.textInsideButton}>Settings</Text>
                            </Button>
                        </View>
                        <View style={styles.singleButtonContainer}>
                            <Button
                                onPress={() => Firebase.auth().signOut()}  
                                rounded style={{backgroundColor: 'white', 
                                padding: 5, width: 150, alignItems: 'center'}}>
                                <Icon name="settings" style={{fontSize: 24, color:'#202020', marginLeft: 10}} />
                                <Text style={styles.textInsideButton}>Signout</Text>
                            </Button>
                        </View>
                        
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerProfile: {
        flex: 1,
        backgroundColor: '#fff'
    },
    profileNavigationBarStyle: {
        justifyContent: 'flex-end',
        marginRight: 10
    },
    nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 23
    },
    userNameContainer: {
        alignItems: 'center',
        padding: 10
    },
    singleButtonContainer: {
        margin: 10,
        elevation: 4,
        alignItems: 'center'
    },
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
    },
    textInsideButton: {
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 17
    },
    profileImage: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
    },
    buttonsContainer: {
        alignItems: 'center'
    },
    imageContainer: {
        height: 300,
        width: 250,
        overflow: 'hidden',
        borderColor: '#dddddd',
        borderRadius: 20,
        borderWidth: 1,
        alignSelf: 'center'
    }

});