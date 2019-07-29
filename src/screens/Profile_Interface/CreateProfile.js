import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight}  from 'react-native';

import { Button, Input, InputGroup, Radio, Spinner} from 'native-base';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import Firebase from '../../../utils/Config';

import Permissions from 'react-native-permissions'

            
import Icon from 'react-native-vector-icons/MaterialIcons';

import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob';

// const options = {
//     title: 'Select Avatar',
//     customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
//     storageOptions: {
//       skipBackup: true,
//       path: 'images',
//     },
//   };


  var gender_props = [
    {label: 'M', value: 0 },
    {label: 'F', value: 1 }
  ];


export default class CreateProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            dp: null,
            value: 0,
            downloadUrl: '',
            currentUser: null,
            nombre: '',
            phone: '',
            errorMessage: null,
            latitude: null,
            longitude: null
            }
    }


    handleName = (nameInfo) => {
        this.setState({
            nombre: nameInfo
        })    
    }

    handlePhone = (phoneNumber) => {
        this.setState({
            phone: phoneNumber
        })   
    }

    saveToDatabase = () => {
        const {currentUser, downloadUrl, nombre, phone} = this.state
        const dbPath = Firebase.database().ref().child('/users/' + currentUser.uid)
        const {latitude, longitude} = this.state
        // const dbImagePath = dbPath.child('profileImages');

        const that = this

        const dataObject = {
            'nombre': nombre,
            'phone': phone,
            'latitude': latitude,
            'longitude': longitude
        }

        const userImageUrl = {
            'profileImageUrl': downloadUrl
        }


        if(nombre.length < 2){
            that.setState({errorMessage: 'Nombre length must be greater than or equal to 2'})
        }else if(phone.length < 10){
            that.setState({errorMessage:'Phone number length must be 10'})
        }else if(downloadUrl.length == 0){
            that.setState({errorMessage: 'Profile image must be provided'})
        }else{
            this.setState({
                loading: true
            })

            dbPath.set(dataObject).then(() => {
                let imagePath = dbPath.child('ProfileImages').push()
                imagePath.set(userImageUrl).then(() => {
                    this.setState({
                        loading: false
                    })
                    this.props.navigation.navigate('Activity')   
                })     
                
            })
    
        }


    }

    componentDidMount(){
        this._requestPermission()
        const {currentUser} = Firebase.auth();

        this.setState(
            {
                currentUser: currentUser
            });

    }


    _requestPermission = () => {
        Permissions.request('location').then(response => {
          // Returns once the user has chosen to 'allow' or to 'not allow' access
          // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
          this.setState({ photoPermission: response })
          if(response == 'restricted'){
            //  alert('restricted')
          }else if(response == 'authorized'){
            this.getCurrentLocation()
          } else {
              alert('Not any one of them')
          }
        })
      }

      getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = parseFloat(position.coords.latitude)
                const longitude = parseFloat(position.coords.longitude)  
                this.setState({
                    latitude: latitude,
                    longitude: longitude  
                })
            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
          );
    }

    openPickerImage = () => {
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

                })
                .catch((error) => {
                    console.log(error)
                })
         })

    }

    render(){
        
        const imageComp = this.state.dp ? (<TouchableHighlight onPress={this.openPickerImage}>
                            <Image source={{uri: this.state.dp}} style={{height: 140, width: 140, borderRadius: 200/2}}/>
                           </TouchableHighlight>
                           ) : ( <View>
                                   <TouchableHighlight onPress={this.openPickerImage}>
                                    <Text>Test</Text>
                                   </TouchableHighlight>
                           </View>
                           )
        const loadImageData = this.state.loading ? (
                            <Spinner color="red"/>
                        ) : (
                            <View>
                               {imageComp}
                            </View>    
                        )

        return(
            <View style={styles.container}>
                    <ScrollView>
                        <View style={{padding: 20}}>
                            {/* Logo Image*/}
  
                       <View style={{padding: 10}}>
                            <Image  source={require('../../../assets/images/bored2.png')} style={{height: 140,  width: 310}}/>
                        </View>
                        <View style={styles.profileImage}>

                             {
                               loadImageData
                             }   

                        </View>
                        {
                            this.state.errorMessage &&
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Icon name="cancel" style={{color: 'red', fontSize: 18}}/>
                                <Text style={{color: 'red', fontSize: 17, marginLeft: 10}}>{this.state.errorMessage}</Text>
                            </View>
                        }

                        <InputGroup borderType='rounded' style={styles.inputGroupStyle} >
                            <Input placeholder='Nombre' stle={styles.inputStyle} onChangeText={this.handleName}/>
                        </InputGroup>
                        
                        <InputGroup borderType='rounded'  style={styles.inputGroupStyle} >
                            <Input placeholder='Phone'  keyboardType='numeric'
                                stle={styles.inputStyle} onChangeText={this.handlePhone}/>
                        </InputGroup>

                        <View style={styles.radioButtonsContainer}>
                            <TouchableHighlight style={{marginRight: 5}}>
                                <Text style={styles.textStyle}>Sexo</Text>    
                            </TouchableHighlight>                            
                            <RadioForm
                                radio_props={gender_props}
                                initial={0}
                                buttonColor={'#fff'}
                                buttonInnerColor={'#e74c3c'}
                                formHorizontal={true}
                                labelHorizontal={true}
                                animation={true} 
                                labelColor={'#fff'}                                   
                                onPress={(value) => {this.setState({value:value})}}
                            />
                        </View>
                     

                        <Button  style={styles.buttonStyle} onPress={this.saveToDatabase} block bordered light>
                            <Text style={{color: 'white'}}>CONFIRM</Text>
                        </Button>

                        </View>
                    </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#202020'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    buttonStyle: {
        marginTop: 20,
        borderRadius: 20
    },
    radioButtonStyle: {
        marginLeft: 20,
        marginRight: 20
    },
    radioButtonsContainer: {
        flexDirection: 'row',
        marginTop: 20,
        color: 'white'
    },
    phoneStyle: {
        marginTop: 10
    },
    inputStyle: {
        color: 'white',
        borderColor: 'white'
    },
    inputGroupStyle: {
        backgroundColor: 'white',
        marginTop: 20,
        borderRadius: 20
    },
    profileImage: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
    },
    navigationBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 46,
        elevation: 10,
        padding: 10,

        // backgroundColor:'red'
    },
    logoImage: {
        flex: 1,
    },
    displayAllcards: {
        flex: 1,
        flexDirection: 'column'
    },
    textTitle: {
        color: 'white',
        justifyContent: 'center',
        marginLeft: 20
    },
    displayActivities: {
        flex: 1,
        // backgroundColor: 'red',
        marginTop: 20
    },
    displayEachActivities: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 200,
        paddingTop: 20,
        borderRadius: 5
    }
});