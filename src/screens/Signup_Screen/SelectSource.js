import {Spinner } from "native-base";
import React, { Component } from 'react';

import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import Firebase from '../../../utils/Config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Permissions from 'react-native-permissions'

import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob';


import { LoginButton, AccessToken,  LoginManager } from 'react-native-fbsdk'

export default class SelectSource extends Component {

    constructor(props){
        super(props)
        this.state = {
            clickedCamera: false,
            clickedGallery: true,
            downloadUrl: null,
            latitude: null,
            longitude: null,
            nombre: null,
            phone: null,
            loading: false
        }




    }
        
    handleOnclick(selectedIdentity){
        if(selectedIdentity == 'gallery'){
            this.setState({
                clickedGallery: true,
                clickedCamera: false
            })

            this.openPickerImage()

        }else if(selectedIdentity == 'camera'){
            this.setState({
                clickedGallery: false,
                clickedCamera: true
            })

            // this.openPickerImage()
            alert("Camera implementation is under development")

       }

    }

    saveToDatabase = () => {
      const {currentUser, downloadUrl, nombre, phone, latitude, longitude} = this.state
      const dbPath = Firebase.database().ref().child('/users/' + currentUser.uid)

      const that = this

      dbPath.once('value', snapshot=> {
          const data = snapshot.val()
          const gender = data.gender
          const nombre = data.nombre
          const phoneNumber = data.phone
          const wantToMeet = data.wantToMeet
          const birthDate = data.birthDate
          
          const dataObject = {
              nombre: nombre,
              birthDate: birthDate,
              phone: phoneNumber,
              gender: gender,
              wantToMeet: wantToMeet,
              latitude: latitude,
              longitude: longitude,
              profileImageUrl: downloadUrl
            }
          that.setState({
            loading: false
          })
          that.props.navigation.navigate('FinalStep', dataObject) 
      })

  }

  componentDidMount(){
    this._requestPermission()
    const {currentUser} = Firebase.auth();

    this.setState(
        {
            currentUser: currentUser
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
                let obj = {}
                obj["loading"] = false
                obj["dp"] = url
                this.setState(obj)
                this.saveToDatabase()

            })
            .catch((error) => {
                console.log(error)
            })
     })

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


  render() {
    
    const {clickedCamera, clickedGallery, loading} = this.state

    return (
      <View style={styles.container}>
            <View style={styles.containNavbar}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('AddBestPicture')}>
                <Icon name="arrow-back" size={30}/>
            </TouchableOpacity>
        
            <Text style={styles.navbarText}>Select Source</Text>
          </View>
            {
              loading ? (
                  <View style={{justifyContent:'center', flexDirection: 'row'}}>
                    <Spinner color="#21CEFF"/> 
                      <View style={{marginLeft: 10, marginTop: 30}}>
                          <Text style={{color: '#21CEFF', fontSize: 18, fontWeight: 'bold'}}>Saving information...</Text>  
                      </View>
                  </View>
                ):(
                <Text style={{color: 'white'}}>''</Text>
              )
            }

            <View style={styles.containInput}>
                <TouchableOpacity  style={clickedCamera ? styles.containSelectorActive: styles.containSelector}
                        onPress={() => this.handleOnclick('camera')}>
                    <View>
                        <Icon name="camera-alt" style={clickedCamera ? {fontSize: 80, color:'#fff' } : {fontSize: 80, color: '#21CEFF'}}/>
                        <Text style={clickedCamera ? styles.containTextActive : styles.containText}>Camera</Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            <View style={styles.containButton}>
                <TouchableOpacity  style={clickedGallery ? styles.containSelectorActive: styles.containSelector}
                    onPress={() => this.handleOnclick('gallery')}>
                    <View>
                        <Icon name="crop-original" style={clickedGallery ? {fontSize: 80, color: '#fff'} : {fontSize: 80, color: '#21CEFF'} }/>
                        <Text style={clickedGallery ? styles.containTextActive : styles.containText}>Gallery</Text>
                    </View>
                </TouchableOpacity>
            </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 15,
    marginHorizontal: 30
  },
  containNavbar: {
    flexDirection: 'row'
  },
  navbarText: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 10  
  },
  containInput: {
    flex: 1,
    marginVertical: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containText: {
    fontSize: 20, 
    fontWeight: '200',
  },
  containTextActive: {
    fontSize: 20,
    fontWeight: '200',
    color: 'white'
  },
  containSelector: {
    paddingVertical: 50,
    paddingHorizontal: 50,
    overflow: 'hidden',
    borderColor: '#dddddd',
    borderRadius: 15,
    borderWidth: 2
  },
  containSelectorActive: {
    paddingVertical: 50,
    paddingHorizontal: 50,
    overflow: 'hidden',
    borderColor: '#dddddd',
    borderRadius: 15,
    borderWidth: 2,
    backgroundColor: '#21CEFF'    
  }
})