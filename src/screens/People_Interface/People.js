import React, {Component} from 'react'
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Dimensions,
         Animated, TouchableOpacity} from 'react-native'
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Firebase from '../../../utils/Config'

import ImageOverlay from "react-native-image-overlay"
import {photos} from '../../../utils/assets'

const { width } = Dimensions.get('window')

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
            noPeople: false,
         }
         this.actName = this.props.navigation.state.params.activityName 
      }
      componentDidMount() {
        const that = this;
        const {currentUser} = Firebase.auth();
        this.setState({currentUser: currentUser.uid})
        const activityDatabaseReference = Firebase.database().ref().child('activities/' + this.actName + '/users');
        const userDatabaseReference = Firebase.database().ref().child('users');
        // start listening to Firebase Database
        this.setState({loading: true})
       
    //   starting
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
                        const userID = peoples[i].id

                        userDatabaseReference.child(peoples[i].id).once("value", (snapShot) => {
                            let data = snapShot.val()
                            const photoArray = []
                            snapShot.child("ProfileImages").forEach(profileData => {
                                const photoData = profileData.val()
                                const profilePhotos = {
                                    image: photoData.profileImageUrl
                                }
                                photoArray.push(profilePhotos)
                                // alert("Profile photos are: " + profilePhotos)
                            })

                            
                            // snapshot.child("ProfileImages").once('value', dts => {
                            //     const dataProfileImage = dts.val()
                            //     alert("Profile data is: " + JSON.stringify(dataProfileImage))
                            // })
                            // alert("Profile Datas are: " + JSON.stringify(data))

                            let personObject = {
                                nombre: data.nombre,
                                phone: data.phone,
                                profileImageUrl: data.profileImageUrl,
                                userId: userID,
                                photos: photoArray
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
     
// ending

   }



    render(){
        // position will be a value between 0 and photos.length - 1 assuming you don't scroll pass the ends of the ScrollView
        let position = Animated.divide(this.scrollX, width);
        
        const {people, loading, noPeople} = this.state
        
        return(
            <View style={styles.containerPeople}>
                    <View style={styles.navigationBar} elevation={20}>
                            <TouchableHighlight style={styles.navigationItems} 
                                onPress={() => this.props.navigation.navigate('Activity')}>
                                <Icon name="arrow-back" size={30}/>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.navigationItems} onPress={() => this.props.navigation.navigate('Activity')}>
                                <Icon name="mood" style={{fontSize: 40, color: '#4DDFE5'}}/>
                            </TouchableHighlight>
                            <View style={styles.navigationItems}>
                                <TouchableHighlight onPress={() => this.props.navigation.navigate('ChatContainer')}>
                                    <Icon name="message" style={{fontSize: 35, color: '#1f1f14'}}/>
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
                        <View style={styles.tabViewStyle}>

                        <View style={styles.singleButtonContainer}>
                            <TouchableHighlight>
                                <Button 
                                rounded style={{backgroundColor: '#4DDFE5', padding: 5, width: 150, alignContent: 'center'}}>
                                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 17, alignSelf: 'center', marginLeft: 15}}>Person</Text>
                                </Button>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.singleButtonContainer}>
                            <TouchableHighlight>
                                <Button   onPress={() => this.props.navigation.navigate('Invitation', {actName: this.actName})}
                                 rounded style={{backgroundColor: 'white', padding: 5, width: 150, alignItems: 'center'}}>
                                    <Text style={styles.textInsideButton}>Invitation</Text>
                                </Button>
                            </TouchableHighlight>
                            
                        </View>

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
                                               <View style={{ flex: 1, marginTop: 20, backgroundColor: '#fff'}}>
                                                        {/* starting point */}

                                                        <ScrollView
                                                            horizontal={true}
                                                            pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
                                                            showsHorizontalScrollIndicator={false}
                                                            // the onScroll prop will pass a nativeEvent object to a function
                                                            scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
                                                            style={{width: "100%", height: "100%"}}
                                                            >
                                                            
                                                            {data.photos.map((source, i) => { // for every object in the photos array...
                                                            return ( // ... we will return a square Image with the corresponding object as the source
                                                            <View  style={styles.imageContainer}>
                                                                    <TouchableHighlight 
                                                                        onPress={() => this.props.navigation.navigate('Profile',
                                                                        {actName: this.actName, userId: data.userId})}
                                                                      >
                                                                        <ImageOverlay
                                                                        key={i}
                                                                        source={{uri: source.image}}
                                                                        style={{width: null, height: null, resizeMode: 'cover'}}
                                                                        contentPosition='bottom'
                                                                        overlayAlpha={0.2}
                                                                        >
                                                                        <View style={{alignItems: 'center'}}>
                                                                            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                                                                                <Button rounded bordered
                                                                                        style={{width: 50,backgroundColor: 'white',
                                                                                            height: 50, justifyContent: 'center', borderColor: 'green'}}>
                                                                                        <TouchableHighlight 
                                                                                           onPress={() => this.props.navigation.navigate('SingleChat', {user: data.userId, actName: this.actName})}
                                                                                           >
                                                                                            <Image source={require('../../../assets/images/messages.png')}
                                                                                                style={{width: 30, height: 30}}/>
                                                                                        </TouchableHighlight>
                                                                                </Button>
                                                                            </View>
                            
                                                                            <View style={{flexDirection: 'row'}}>
                                                                                {/* Display the dots for the profile Images  */}
                                                                                {data.photos.map((_, i) => { // the _ just means we won't use that parameter
                                                                                    let opacity = position.interpolate({
                                                                                        inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
                                                                                        outputRange: [0.3, 1, 0.3], // when position is not i, the opacity of the dot will animate to 0.3
                                                                                        // inputRange: [i - 0.50000000001, i - 0.5, i, i + 0.5, i + 0.50000000001], // only when position is ever so slightly more than +/- 0.5 of a dot's index
                                                                                        // outputRange: [0.3, 1, 1, 1, 0.3], // is when the opacity changes from 1 to 0.3
                                                                                        extrapolate: 'clamp' // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
                                                                                    })
                                                                                    return (
                                                                                        <Animated.View
                                                                                        key={i}
                                                                                        style={{height: 15, width: 15, backgroundColor: '#202020',
                                                                                            margin: 8, borderRadius: 10, marginTop: 15}}
                                                                                        />
                                                                                    )
                                                                                })}
                                                                                    
                                                                            </View>    
                            
                                                                        </View>



                                                                    </ImageOverlay> 
                                                                </TouchableHighlight>
                                                            
                                                            </View>
                                                            
                                                            )
                                                            })}

                                                        </ScrollView>
                                                        
                                                        {/* ending point */}

                                                </View>
                                                <View style={styles.profileInfoContainer}>
                                                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                                    
                                                        {/* <TouchableOpacity
                                                            onPress={() => this.props.navigation.navigate('SingleChat', {user: data.userId, actName: this.actName})}>
                                                        <Text>Chat</Text>
                                                        </TouchableOpacity> */}
                                                        <Text style={{fontSize: 20, fontWeight:'bold'}}>{data.nombre}  27</Text>
                                                        <Image source={require('../../../assets/images/camera_1.png')} 
                                                            style={{width: 25, height: 25, marginLeft: 60}}/>
                                                        <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 5}}>{data.photos.length}</Text>   
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
        backgroundColor: '#fff',
        padding: 10
    },
    peopleNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60
    },
    navigationBar: {
        height: 60,
       flexDirection: 'row',
       justifyContent: 'space-between',
       elevation: 2,
       marginRight: 5
   },
   navigationItems: {
        marginVertical: 10
    },
    shadowStyle: {
        marginBottom: 30,
        height: 1,
        backgroundColor: '#d6d6c2'
    },
    tabViewStyle: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'space-between'
    },
    textInsideButton: {
        marginLeft: 15,
        fontWeight: 'bold',
        fontSize: 17
    },
    peopleImageStyle: {
        backgroundColor: 'white',
        marginTop: 20
    },
    singleButtonContainer: {
        margin: 10,
        elevation: 4,
        alignItems: 'center'
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
      },
      imageContainer: {
        // height: '80%',
        // width: '60%',
        width: 320,
        height: 320,
        overflow: 'hidden',
        borderColor: '#dddddd',
        borderRadius: 25,
        borderWidth: 1,
        marginRight: 25,
        marginLeft: 10
    },
    profileInfoContainer: {
        overflow: 'hidden',
        borderColor: '#dddddd',
        borderRadius: 25,
        borderWidth: 1,
        marginTop: 5,
        padding: 5

    }

});