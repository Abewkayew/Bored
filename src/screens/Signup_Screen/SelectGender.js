import { Container, Item, Form, Input, Button, Label, Spinner, InputGroup } from "native-base";
import React, { Component } from 'react';

import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

import Firebase from '../../../utils/Config';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { LoginButton, AccessToken,  LoginManager } from 'react-native-fbsdk'

export default class SelectGender extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedMale: true,
            selectedFemale: false,
            meetMale: false,
            meetFemale: false,
            userGender: 'male',
            userMeetsGender: null
        }
        this.phoneNumber = this.props.navigation.state.params.phoneNumber
        this.handleIam = this.handleIam.bind(this)
        this.handleWantToMeet = this.handleWantToMeet.bind(this)

      }
      

    saveState = () => {
      const {userGender, userMeetsGender} = this.state
      const phoneNumber = this.phoneNumber
      this.props.navigation.navigate('AddFirstName', {
        userGender: userGender,
        userMeetsGender: userMeetsGender, 
        phoneNumber: phoneNumber
      })
    }

    handleIam(selectedGender){
        if(selectedGender == 'male'){
            this.setState({
                selectedMale: true,
                selectedFemale: false,
                userGender: 'male'
            }) 
        }else if(selectedGender == 'female'){
            this.setState({
                selectedMale: false,
                selectedFemale: true,
                userGender: 'female'
            })
        }
    }

    handleWantToMeet(selectedGender){
        if(selectedGender == 'male'){
            this.setState({
                meetMale: true,
                meetFemale: false,
                userMeetsGender: 'male'
            }) 
        }else if(selectedGender == 'female'){
            this.setState({
                meetMale: false,
                meetFemale: true,
                userMeetsGender: 'female'
            })
        }
    }



  render() {
    
    const {selectedMale, selectedFemale, meetFemale, meetMale} = this.state

    return (
      <View style={styles.container}>
          <Text style={styles.testText}>I am a</Text>
          <View style={styles.containGender}>
                {/* <Text style={styles.genderName}>Male</Text>   */}
            <TouchableOpacity
                style={selectedMale ? styles.styleGenderActive: styles.styleGender}
                onPress={() => this.handleIam('male')}
              >
                <View>
                    <Text style={styles.genderName}>Male</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity  
              style={selectedFemale ? styles.styleGenderActive: styles.styleGender}
              onPress={() => this.handleIam('female')}
            >
                <View>
                    <Text style={styles.genderName}>Female</Text>
                </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.testText}>I would like to meet</Text>
          <View style={styles.containGender}>
            <TouchableOpacity
                style={meetMale ? styles.styleGenderActive: styles.styleGender}
                onPress={() => this.handleWantToMeet('male')}
            >
                <View>
                    <Text style={styles.genderName}>Male</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={meetFemale ? styles.styleGenderActive: styles.styleGender}
                onPress={() => this.handleWantToMeet('female')}
             >
                <View>
                    <Text style={styles.genderName}>Female</Text>
                </View>
            </TouchableOpacity>

          </View>
          <View style={styles.containNextButton}>
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
    paddingVertical: 60,
    marginHorizontal: 30
  },
  styleGender: {
    flex: 1,
    backgroundColor: '#9c9a9a',
    height: 130,
    marginRight: 20,
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: '#dddddd',
    borderRadius: 10,
    borderWidth: 1
  },
  styleGenderActive:{
    flex: 1,
    backgroundColor: '#21CEFF',
    height: 130,
    marginRight: 20,
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: '#dddddd',
    borderRadius: 10,
    borderWidth: 1
  },
  containNextButton: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  genderName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '200'
  },
  testText: {
     fontSize: 20, 
     fontWeight: '400'
  },
  containGender: {
      flexDirection: 'row',
      justifyContent: 'space-between'
  }
})