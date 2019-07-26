import { Container, Item, Form, Input, Button, Label, Spinner, InputGroup } from "native-base";
import React, { Component } from 'react'

import { StyleSheet, Text, TouchableHighlight, View, Image, ScrollView, Animated, Dimensions } from 'react-native';

import Firebase from '../../../utils/Config'

import Icon from 'react-native-vector-icons/MaterialIcons'

import ImageOverlay from "react-native-image-overlay"
import ImagePicker from 'react-native-image-crop-picker'
import RNFetchBlob from 'react-native-fetch-blob'

const { width } = Dimensions.get('window')


export default class EditProfile extends Component {

 constructor(props){
     super(props)
     this.state = {
        loading: false,
        dp: null,
        downloadUrl: '',
        currentUser: null,
        errorMessage: null,
        totalPhotos: 0,
        profileImages: [],
        userPhoto: '',
        fullName: null
        }
 }

 deletePhoto = (photoID) => {
    // delete the selected photo
    const dbPath = Firebase.database().ref().child('/users/' + this.state.currentUser)
    let profileImagePath = dbPath.child('ProfileImages').child(photoID)

    profileImagePath.remove()
 }
 
 saveChanges = () => {
    const {downloadUrl} = this.state
    const dbPath = Firebase.database().ref().child('/users/' + this.state.currentUser)
    let profileImagePath = dbPath.child('ProfileImages').push()
   
    const userImageUrl = {
        'profileImageUrl': downloadUrl
    }
    profileImagePath.set(userImageUrl)

 }

 componentDidMount(){
    const {currentUser} = Firebase.auth();

    this.setState(
        {
            currentUser: currentUser.uid
        });

    const dbPath = Firebase.database().ref().child('/users/' + currentUser.uid);

    dbPath.once('value', datasnapshot => {
        const userData = datasnapshot.val()
        const userFullName = userData.nombre
        this.setState({
            fullName: userFullName
        })
    })    


    let profileImagePath = dbPath.child('ProfileImages')

    profileImagePath.on('value', datasnapShot => {
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
                        let photoKey = snapShot.key

                        let profileImageObject = {
                            profileImageUrl: data.profileImageUrl,
                            photoID: photoKey
                        }
                                
                        photoArray.push(profileImageObject)
                        this.setState({
                            profileImages: photoArray,
                            loading: false
                        })
                        }
                    )
                    // }
                }
                


            }



        })    


        this.setState({
            totalPhotos: countTotal
        })

    })
        
 }


 openPickerImage = () => {
    const {currentUser} = this.state
    const dbPath = Firebase.database().ref().child('/users/' + currentUser.uid);

    let profileImagePath = dbPath.child('ProfileImages').push()
    
    this.setState({loading: true})
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs

    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob;
    ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        mediaType: 'photo'
    }).then(image => {
        const ImagePath = image.path
        // console.log("Image Data are: ", image)
        let uploadBlob = null
        const imageRef = Firebase.storage().ref().child('profileImages/')
        
        let mime = 'image/jpg'
        // alert(image)
        fs.readFile(ImagePath, 'base64')
            .then((data) => {
                //  console.log(data)
                 return Blob.build(data, {type: `${mime};BASE64`})   
            })
            .then((blob) => {
                uploadBlob = blob
                return imageRef.put(blob, {contentType: mime})
            })
            .then(() => {
                uploadBlob.close()
                imageRef.getDownloadURL().then((url) => {
                    this.setState({
                        downloadUrl: url
                    })
                })
                return imageRef.getDownloadURL()
            })
            .then((url) => {
                let userData = {}
                let obj = {}
                obj["loading"] = false
                obj["dp"] = url
                this.setState(obj)
                this.saveChanges()
            
            })
            .catch((error) => {
                console.log(error)
            })
            
     })

}



 render() {
    
    const {dp, totalPhotos, profileImages, userPhoto, fullName} = this.state
    
    const userProfilePicture = profileImages[profileImages.length - 1]
    let profilePicture = ''
    for (var key in userProfilePicture){ 
        profilePicture = userProfilePicture[key]
    }
   
    return(
        <View style={styles.container}> 
            <ScrollView>
                <View style={styles.profileEditorStyle}>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('MyProfile')}>
                        <Icon name="arrow-back" size={30}/>
                    </TouchableHighlight>
                    <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 10}}>
                        Profile Editing
                    </Text>
                </View>

                {/* <Text>User Image: {userProfilePicture['profileImageUrl']}</Text> */}
                {/* starting */}

                <View style={{margin: 10}}>
                    <Button danger onPress={() => this.openPickerImage()}
                       rounded full transparent rounded bordered info>
                        <Icon name='add' size={30} style={{color: '#1cc9be'}}/>
                        <Text style={{fontSize: 18, marginLeft: 20, fontWeight: 'bold', color: '#1cc9be'}}>Add new profile picture</Text>
                    </Button>
                </View>

                <View style={{marginTop: 10}}>
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
                     {
                        profileImages.map((data, index) => { // for every object in the photos array...
                            return ( // ... we will return a square Image with the corresponding object as the source
                            <TouchableHighlight>
                                    <ImageOverlay
                                        key={index}
                                        source={{uri: data.profileImageUrl}}
                                        style={{width, height: 200}}
                                        contentPosition='bottom'>
                                            {/* <TouchableHighlight onPress={() => alert('Message works')}> */}
                                            <View style={{marginBottom: 5}}>
                                                {
                                                    profileImages.length > 1 ? (
                                                      <Button rounded transparent bordered info onPress={() => this.deletePhoto(data.photoID)}>
                                                            <Icon name='cancel' size={30} style={{marginLeft: 10, color: '#fff'}}/>
                                                            <Text style={{fontSize: 18, color: '#fff',
                                                                fontWeight: 'bold', marginLeft: 5, marginRight: 10}}>
                                                                remove this photo
                                                            </Text>
                                                        </Button>
                                                    ): (
                                                        <View>
                                                            <Text>-</Text>
                                                        </View>
                                                    )
                                                }
                                            </View>
                                    </ImageOverlay>  
                            </TouchableHighlight>
                            )

                        })
                   }
                    </ScrollView>
                </View>     
                <View style={styles.aboutAndEduContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.infoUser}>About {fullName}</Text>
                        <InputGroup borderType='underline' >
                            <Input placeholder='Tell people about you'
                                   onChangeText={this.handleAbout} />
                        </InputGroup>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.infoUser}>Education</Text>
                        <InputGroup borderType='underline' >
                            <Input placeholder='Let people know where you studied'
                                   onChangeText={this.handleEducation}/>
                        </InputGroup>
                    </View>
                    <Button onPress={() => this.saveChanges()}
                       rounded full transparent rounded bordered info>
                        <Text style={{fontSize: 18, marginLeft: 20, fontWeight: 'bold', color: '#1cc9be'}}>Save Changes</Text>
                    </Button>
                </View>


                {/* ending */}
                {/* <View style={styles.styleImageContainers}>
                    
                    <TouchableHighlight onPress={() => this.openPickerImage()}>
                        {
                            dp ? (
                                <Image source={{uri: this.state.dp}} 
                                style={{height: 150, width: 100}}/>
                            ): (
                                <Image 
                                    source={require('../../../assets/images/backgroundfotos.png')} 
                                    style={{height: 150, width: 100}}
                                />
                            )
                        }
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.openPickerImage()}>
                        <Image 
                            source={require('../../../assets/images/backgroundfotos.png')} 
                            style={{height: 150, width: 100}}
                        />

                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.openPickerImage()}>
                        <Image 
                            source={require('../../../assets/images/backgroundfotos.png')} 
                            style={{height: 150, width: 100}}
                        />
                    </TouchableHighlight>

                </View> */}
            </ScrollView>
        </View>
      )
   }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  profileEditorStyle: {
    flexDirection: 'row',
    height: 60,
    marginTop: 20,
    marginLeft: 10
  },
  infoUser: {
    fontSize: 20,
    fontWeight: 'bold'
  },    
  aboutAndEduContainer: {
    marginHorizontal: 20
  },
  styleImageContainers: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      alignItems: 'flex-start'
   },
   textContainer: {
       paddingTop: 10,
       paddingBottom: 5
   }
});