import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight}  from 'react-native';

import { Button, Input, InputGroup, Radio, Spinner} from 'native-base';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import Firebase from '../../../utils/Config';

import Permissions from 'react-native-permissions'

            
import Icon from 'react-native-vector-icons/MaterialIcons';
// import RNFetchBlob from 'react-native-fetch-blob';
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
            phone: ''
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
        const {currentUser, downloadUrl, nombre, phone} = this.state; 
        const dbPath = Firebase.database().ref().child('/users/' + currentUser.uid);
        // const dbImagePath = dbPath.child('profileImages');

        const dataObject = {
            'nombre': nombre,
            'phone': phone,
            'profileImageUrl': downloadUrl

        }

        if( (nombre.length < 2) && (phone.length < 5) && (downloadUrl == null) ){
            alert('Nombre, Phone and Image input are required')
        }else{
            this.setState({
                loading: true
            })
            dbPath.set(dataObject).then(() => {
                this.setState({
                    loading: false
                })
                this.props.navigation.navigate('Activity')   
            
            });    
    
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
                // alert("Permission granted")
          } else {
              alert('Not any one of them')
          }
        })
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
                                        <Image source={require('../../../assets/images/profile.png')} style={{height: 140, width: 140}}/>
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