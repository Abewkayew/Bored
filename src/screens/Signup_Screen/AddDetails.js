import {CheckBox, Input, Button, DatePicker, InputGroup, Spinner } from "native-base";
import React, { Component } from 'react';

import { StyleSheet, Text, TouchableHighlight, View, Image } from 'react-native';
import Firebase from '../../../utils/Config';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { LoginButton, AccessToken,  LoginManager } from 'react-native-fbsdk'

export default class AddDetails extends Component {

    constructor(props){
        super(props)

        this.state = {
            birthDate: null,
            email: null,
            password: 'password',
            loading: false
        }

        this.phoneNumber = this.props.navigation.state.params.phoneNumber
        this.userMeetsGender = this.props.navigation.state.params.userMeetsGender
        this.userGender = this.props.navigation.state.params.userGender
        this.name = this.props.navigation.state.params.name
        
    }

    handleBirthDate = (birthDate) => {
        this.setState({
            birthDate: birthDate
        })
    }

    handleEmail = (emailAddress) => {
        this.setState({
          email: emailAddress
        })
    }

  saveState = () => {
    let that = this
    const {birthDate, email, password} = this.state
    const phoneNumber = this.phoneNumber
    const userMeetsGender = this.userMeetsGender
    const userGender = this.userGender
    const name = this.name


    if(email == null){
      alert("You must provide email address")
      return
    }else if(birthDate == null){
      alert("You must provide birth Date information")
      return
    }

    this.setState({
      loading: true
    })

    Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {

        const userID = user.user.uid
        const dbPath = Firebase.database().ref().child('/users/' + userID)
        userObject = {
          phone: phoneNumber,
          wantToMeet: userMeetsGender,
          gender: userGender,
          nombre: name,
          birthDate: String(birthDate),
        }

        dbPath.set(userObject).then(() => {
          let imagePath = dbPath.child('ProfileImages').push()
          imagePath.set(userImageUrl).then(() => {
              this.setState({
                  loading: false
              })
              that.props.navigation.navigate('AddBestPicture')
          })     
          
      })

      })
      .catch(error => that.setState({ errorMessage: error.message, loading: false }))

  }

  render() {

    const {loading} = this.state
    const userGender = this.userGender
    const userMeetsGender = this.userMeetsGender
    const phoneNumber = this.phoneNumber

    return (
      <View style={styles.container}>
          <View style={styles.containNavbar}>
            <TouchableHighlight onPress={() => this.props.navigation.navigate('AddFirstName', {
                 userGender: userGender,
                 userMeetsGender: userMeetsGender,
                 phoneNumber: phoneNumber
                })}
            >
                <Icon name="arrow-back" size={30}/>
            </TouchableHighlight>

            <Text style={styles.navbarText}>Your Details</Text>
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
              <View style={styles.containDateEmail}>
                <Text style={styles.info}>Birth Date</Text>
                <DatePicker
                  defaultDate={new Date()}
                  minimumDate={new Date(1950, 1, 1)}
                  maximumDate={new Date()}
                  locale={"en"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText="DD / MM / YYYY"
                  textStyle={styles.dateInput}
                  // placeHolderTextStyle={{ color: "#d3d3d3" }}
                  onDateChange={this.handleBirthDate}
                />
                {/* <Text style={styles.dateInput}>DD / MM / YYYY</Text> */}
              </View>
              <View style={styles.containDateEmail}>
                <Text style={styles.info}>Email</Text>
                <InputGroup borderType='underline'>
                  <Input placeholder='johndoe@gmail.com'
                          onChangeText={this.handleEmail} />
                </InputGroup>
              </View>
              <View style={styles.containTermsAndConditions}>
                <CheckBox checked={true} style={{marginVertical: 5}}/>
                <View style={{marginLeft: 30}}>
                  <Text style={{fontSize: 18}}>I Am Agree With All</Text>
                  <Text style={{textDecorationLine: 'underline', fontSize: 18, color: '#21CEFF'}}>Terms and Condition</Text>
                </View>
              </View>
          </View>



          <View style={styles.containButton}>
            <Button rounded transparent info onPress={() => this.saveState()}
                    style={{backgroundColor: '#21CEFF', width: 150, justifyContent: 'center'}}>
                    <Text style={{fontSize: 18, color: '#fff',
                        fontWeight: '500', marginLeft: 5, marginRight: 10}}>
                        Next
                    </Text>
                    <Icon name="arrow-forward" style={{color: 'white', fontSize: 30, fontWeight: '100'}}/>
                </Button>
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
  containDateEmail: {
    marginVertical: 20
  },
  info: {
    fontSize: 20, 
    fontWeight: '100',
    marginBottom: 10
  },
  dateInput: {
    fontSize: 20,
    fontWeight: '100'
  },
  containInput: {
    flex: 2,
    marginVertical: 50
  },
  containButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containTermsAndConditions: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }

})