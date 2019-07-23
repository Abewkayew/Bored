import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions, Animated} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base';

import Icon from 'react-native-vector-icons/MaterialIcons';

import ImageOverlay from "react-native-image-overlay";
import Firebase from 'firebase'


import {getDistanceFromLatLonInKm} from '../../../utils/getDistance';
import {photos} from '../../../utils/assets'

const { width } = Dimensions.get('window');


export default class Profile extends Component{
    constructor(props){
        super(props)
        this.actName = this.props.navigation.state.params.actName 
        this.userId = this.props.navigation.state.params.userId
        this.dbRef = Firebase.database().ref()
 
        this.state = {
            profileImages: [],
            fullName: '',
            distance: null,
            loading: true
        }

    }
 
    componentDidMount(){
        const {currentUser} = Firebase.auth();

        const userPath = this.dbRef.child('users')
        const usersDBPath = userPath.child(this.userId);
        const currentUserDBPath = userPath.child(currentUser.uid)

        let profileImagePath = usersDBPath.child('ProfileImages')
        let that = this
        usersDBPath.once('value', dtSnapshot => {
            const realData = dtSnapshot.val()
            const fullName = realData.nombre
            const userLatitude = realData.latitude
            const userLongitude = realData.longitude
            
            currentUserDBPath.once('value', dataSnap => {
                const currentUserData = dataSnap.val()
                const currentUserLatitude = currentUserData.latitude
                const currentUserLongitude = currentUserData.longitude
               
                let distanceInBetween = getDistanceFromLatLonInKm(currentUserLatitude, currentUserLongitude,
                                                                  userLatitude, userLongitude)

                distanceInBetween = distanceInBetween.toFixed(0)

                this.setState({distance: distanceInBetween})
                
            })
             
            that.setState({
                fullName: fullName,
            })
        })

        profileImagePath.once('value', datasnapShot => {
            var profilePhotos = []
            datasnapShot.forEach(profileDatas => {
                const data = profileDatas.val()
                let profileImageKey = {
                    photoUrl: data.profileImageUrl
                }
                profilePhotos.push(profileImageKey)

            })
            that.setState({
                profileImages: profilePhotos,
                loading: false
            })
        })

    }

    componentWillUnmount(){
        this.dbRef.off()
    }


    scrollX = new Animated.Value(0) // this will be the scroll location of our ScrollView

    render(){

        // position will be a value between 0 and photos.length - 1 assuming you don't scroll pass the ends of the ScrollView
        let position = Animated.divide(this.scrollX, width)
        const {profileImages, fullName, loading, distance} = this.state
              
        return(
            <View style={styles.containerProfile}>
                <View style={styles.profileNavbar}>
                    <View style={{flexDirection: 'row', marginVertical: 5}}>
                        <TouchableHighlight  onPress={() => this.props.navigation.navigate('People', {activityName: this.actName})}>
                            <Icon name="arrow-back" color="#000" size={30}/>
                        </TouchableHighlight>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold', left: 30}}>
                            <Text style={{color: '#000', fontSize: 25, fontWeight: 'bold', paddingBottom: 10}}>Profile</Text>
                        </Text>
                    </View>
                    <View style={styles.navigationItems}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('ChatContainer')}>
                            <Icon name="message" style={{fontSize: 30, color: '#1f1f14'}}/>
                        </TouchableHighlight>
                        <Button  
                            rounded style={{top: -15, left: 15, backgroundColor: '#4DDFE5',
                            padding: 5, width: 20, height: 20, alignContent: 'center'}}>
                            <Text style={{color: 'white'}}>2</Text>
                        </Button>
                    </View>
                </View>

                <View style={styles.shadowStyle}></View>

                <ScrollView>

                    <View style={{marginTop: 5, backgroundColor: '#fff'}}>
                        
                            <View>
                                {
                                    loading ? (
                                           <View style={[styles.imageContainer, {justifyContent: 'center'}]}>
                                               <Spinner color="red"/>
                                           </View>
                                        ):(
                                            <ScrollView
                                            horizontal={true}
                                            pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
                                            showsHorizontalScrollIndicator={false}
                                            // the onScroll prop will pass a nativeEvent object to a function
                                            onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
                                            [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
                                            )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
                                            scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
                                            contentContainerStyle={styles.contentContainer}
                                            nestedScrollEnabled={false}
                                            snapToEnd={false}
                                            contentInset={{top: 100}}
                                            disableIntervalMomentum={true}
                                            >
                                            {profileImages.map((source, i) => { // for every object in the photos array...
                                            return ( // ... we will return a square Image with the corresponding object as the source
                                            <View  style={styles.imageContainer}>
             
                                                <ImageOverlay
                                                key={i}
                                                source={{uri: source.photoUrl}}
                                                style={{width: null, height: null, resizeMode: 'cover'}}
                                                contentPosition='bottom'
                                                overlayAlpha={0.2}
                                                >
                                                <View style={{alignItems: 'center'}}>
                                                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                                                        <Button rounded bordered
                                                                style={{width: 50,backgroundColor: 'white',
                                                                    height: 50, justifyContent: 'center', borderColor: 'green'}}>
                                                                <TouchableHighlight onPress={() => this.props.navigation.navigate('SingleChat', {actName: this.actName})}>
                                                                    <Image source={require('../../../assets/images/messages.png')}
                                                                        style={{width: 30, height: 30}}/>
                                                                </TouchableHighlight>
                                                        </Button>
                                                    </View>
            
                                                    <View style={{flexDirection: 'row'}}>
                                                        {/* Display the dots for the profile Images  */}
                                                        {profileImages.map((_, i) => { // the _ just means we won't use that parameter
                                                        let opacity = position.interpolate({
                                                            inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
                                                            outputRange: [0.3, 1, 0.3], // when position is not i, the opacity of the dot will animate to 0.3
                                                            // inputRange: [i - 0.50000000001, i - 0.5, i, i + 0.5, i + 0.50000000001], // only when position is ever so slightly more than +/- 0.5 of a dot's index
                                                            // outputRange: [0.3, 1, 1, 1, 0.3], // is when the opacity changes from 1 to 0.3
                                                            extrapolate: 'clamp' // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
                                                        });
            
                                                            return (
                                                                <Animated.View // we will animate the opacity of the dots later, so use Animated.View instead of View here
                                                                key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                                                                style={{ opacity, height: 15, width: 15, backgroundColor: '#202020', margin: 8, 
                                                                borderRadius: 10, marginTop: 15}}
                                                                />
                                                            );
                                                            })}
                                                            
                                                    </View>    
            
                                                </View>
            
            
            
                                            </ImageOverlay> 
                                              
                                            </View>                                      
                                            )
                                            })}
                                        </ScrollView>
                                     )
                                }
                              
                            </View>
                            <View style={styles.profileInfoContainer}>
                                <View style={styles.userInfo}>
                                    <Text style={styles.userFullName}>{fullName}</Text>
                                    <Text style={styles.yearStyle}>21 Y.</Text>
                                </View>
                                <View style={styles.userMoreInfo}>
                                    <Image source={require('../../../assets/images/education_1.png')} style={{width: 30, height: 30}}/>
                                    <Text style={styles.textStyle}>University of Lima</Text>
                                </View>
                                <View style={styles.userMoreInfo}>
                                    <Image source={require('../../../assets/images/compass_icon.png')} style={{width: 30, height: 30}}/>  
                                    <Text style={styles.textStyle}>
                                        { distance < 1000 ? (   
                                                distance == 0 ? (
                                                    <Text style={{fontSize: 18}}>You are in the same place</Text>
                                                ): (
                                                    <Text style={{fontSize: 18}}>{distance} m </Text>
                                                )
                                            ) :
                                            (   
                                                <Text style={{fontSize: 18}}>{(distance)/1000} km </Text>
                                            )
                                        }
                                    </Text>
                                </View>
                                <Text style={styles.profileSaying}>"Your time is limited, so don't waste it living someone else's life."</Text>
                                <Text style={styles.hashtags}>#self_motivated</Text>
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
        backgroundColor: '#fff',
    },
    profileNavbar: {
        flexDirection: 'row',
        height: 50,
        padding: 5,
        margin: 10,
        justifyContent: 'space-between'
    },
    profileInfoContainer: {
        overflow: 'hidden',
        borderColor: '#dddddd',
        borderTopEndRadius: 25,
        borderTopStartRadius: 25,
        borderWidth: 1,
        marginTop: 5,
        backgroundColor: '#edece8',
        padding: 30
    },
    userFullName: {
        color: '#1cc9be',
        fontSize: 25,
        fontWeight: 'bold'
    },
    yearStyle: {
        fontSize: 22
    },
    navigationItems: {
        marginVertical: 5
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userMoreInfo: {
        flexDirection: 'row',
        marginTop: 10
    },
    textStyle: {
        marginLeft: 15,
        fontSize: 22
    },
    profileSaying: {
        marginTop: 15,
        fontSize: 18
    },
    hashtags: {
        color: '#1cc9be',
        fontSize: 18,
        marginTop: 15
    },
    shadowStyle: {
        marginBottom: 30,
        height: 1,
        backgroundColor: '#d6d6c2'
    },
    imageContainer: {
        // height: '90%',
        // width: '80%',
        width: 320,
        height: 320,
        overflow: 'hidden',
        borderColor: '#dddddd',
        borderRadius: 25,
        borderWidth: 1,
        marginRight: 25,
        marginLeft: 25
    }
})