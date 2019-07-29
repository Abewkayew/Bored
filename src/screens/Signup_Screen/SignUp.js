import { Container, Item, Form, Input, Button, Label, Spinner, InputGroup } from "native-base";
import React, { Component } from 'react';

import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';

import Firebase from '../../../utils/Config';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { LoginButton, AccessToken,  LoginManager } from 'react-native-fbsdk'

export default class SignUp extends Component {
  constructor(props){
    super(props)
    this.state = {
      errorMessage: null,
      phone: null
    }
  }


  signUp = () => {
    // alert("It works")
    this.setState({
      loading: true
    })
    //Firebase Logic to SignUp the user goes here...

   const {email, password} = this.state
   const that = this
   if(password.length >= 6){
      Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        that.setState({
          loading: false
        })
        that.props.navigation.navigate('CreateProfile')
      })
      .catch(error => that.setState({ errorMessage: error.message, loading: false }))
   }else if(email.length <3){
     that.setState(
       {loading: false,
        errorMessage: 'Email length must be greater than 3'
      })
   }
   else{
     that.setState(
      {loading: false,
       errorMessage: 'Password length must be greater than or equal to 6'
     })
   }

  }


  handlePhone = (phoneNumber) => {
      this.setState({
          phone: phoneNumber
      })   
  }

  saveState = () => {
    let {errorMessage, phone} = this.state
    const correctPhoneNumber = "+51" + phone
    if(phone == null){
      alert("You must provide your phone number")
      return
    }else if(phone.length < 9){
      alert("The length of phone number must be 10")
      return
    }

    this.props.navigation.navigate('SelectGender', {phoneNumber: correctPhoneNumber})
  }


  handleFacebookLogin = () => {
    // alert("Facebook login to be done later")
    this.props.navigation.navigate('Login')
  }
  handleGoogleLogin = () => {
    alert("Google login to be done later")
  }
  render() {
      
    return (
      <Container style={styles.container}>
        <ImageBackground
         source={require('../../../assets/images/signupbackground_five.jpg')}
         style={{width: '100%', height: '100%'}}
         >
           
            <View style={styles.containTop}>
                <Image
                  source={require('../../../assets/images/bored_logo_two.png')}
                  style={{width: 300, height: 70}}
                />
                <View style={styles.containTexts}>
                  <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 15}}>Meet people who want to do</Text>
                  <Text style={{alignSelf: 'center', fontSize: 20, fontWeight: 'bold', color: 'white'}}>the same thing as you</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <Button rounded onPress={() => this.handleFacebookLogin()}
                      style={{backgroundColor: '#3B5998', justifyContent: 'center', paddingHorizontal: 5}}>
                      <Image 
                        source={require('../../../assets/images/facebook_logo_one.png')}
                        style={{width: 30, height: 30, marginLeft: 10}}
                      />
                      <Text style={{color: '#fff', fontWeight: 'bold',
                          marginHorizontal: 20}}>
                          Continue with Facebook
                      </Text>
                  </Button>
                </View>
                <View style={styles.buttonContainer}>
                  <Button rounded  onPress={() => this.handleGoogleLogin()}
                      style={{backgroundColor: '#DD4B39', justifyContent: 'center', paddingHorizontal: 10, marginVertical: 10}}>
                      <Image 
                        source={require('../../../assets/images/google_icon.png')}
                        style={{width: 30, height: 30, marginLeft: 10}}
                      />
                      <Text style={{color: '#fff', fontWeight: 'bold',
                          marginHorizontal: 20}}>
                          Continue with Google
                      </Text>
                  </Button>
                </View>
                <View style={styles.containerOr}>
                  <Text style={{color: 'white', alignSelf: 'center', fontSize: 20, fontWeight: 'bold'}}>Or</Text>
                </View>
            </View>
            <View style={styles.containBottom}>
                <View style={styles.buttonContainer}>
                  <Text style={{color: 'white', fontSize: 17, fontWeight: 'bold'}}>Enter your phone number</Text>
                  <View style={{flexDirection: 'row', marginVertical: 10}}>
                      <View style={{width: 50, marginRight: 20}}>
                        <InputGroup borderType="underline">
                          <Input placeholder='+51' 
                              style={{color: 'white',borderColor: 'white'}}
                              placeholderTextColor={'white'}  
                              keyboardType='numeric'
                              editable={false}
                              onChangeText={this.handleAbout} />
                        </InputGroup>
                      </View>
                      <View style={{width: 200}}>
                        <InputGroup borderType="underline">
                        <Input placeholder='Number' 
                            style={{color: 'white',borderColor: 'white'}}
                            placeholderTextColor={'white'}  
                            keyboardType='numeric'
                            onChangeText={this.handlePhone} />
                        </InputGroup>
                      </View>
                  </View>
                  <Button rounded bordered transparent light onPress={() => this.saveState()}
                        style={{width: 150, justifyContent: 'center', alignSelf: 'center'}}>
                        <Text style={{fontSize: 18, color: '#fff',
                            fontWeight: '500', marginLeft: 5, marginRight: 10}}>
                            Next
                        </Text>
                        <Icon name="arrow-forward" style={{color: 'white', fontSize: 30, fontWeight: '100'}}/>
                    </Button>
                
                </View>
            </View>

        </ImageBackground>

      </Container>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  buttonContainer: {
    marginVertical: 15
  },
  containerOr: {
    marginVertical:10,
  },
  containTexts: {
      marginTop: 25,
      marginBottom: 10
  },
  containTop:{
    flex: 1,
    marginHorizontal: 40,
    marginVertical: 40
  },
  containBottom: {
    flex: 0.5,
    marginHorizontal: 40, 
    marginVertical: 40
  }

});