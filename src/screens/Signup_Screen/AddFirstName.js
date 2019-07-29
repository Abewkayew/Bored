import { Container, Item, Form, Input, Button, Label, Spinner, InputGroup } from "native-base";
import React, { Component } from 'react';

import { StyleSheet, Text, TouchableHighlight, View, Image } from 'react-native';
import Firebase from '../../../utils/Config';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { LoginButton, AccessToken,  LoginManager } from 'react-native-fbsdk'

export default class AddFirstName extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: false
        }

        this.phoneNumber = this.props.navigation.state.params.phoneNumber
        this.userMeetsGender = this.props.navigation.state.params.userMeetsGender
        this.userGender = this.props.navigation.state.params.userGender
       
    }

    handleNameFill = (fullName) => {
        this.setState({
            name: fullName
        })
    }

    

    saveState = () => {
      const {name} = this.state
      const phoneNumber = this.phoneNumber
      const userMeetsGender = this.userMeetsGender
      const userGender = this.userGender
      this.props.navigation.navigate('AddDetails', {
        name: name,
        phoneNumber: phoneNumber,
        userMeetsGender: userMeetsGender,
        userGender: userGender
      })
    }


  render() {
    
    const phoneNumber = this.phoneNumber

    return (
      <View style={styles.container}>
          <View style={styles.containNavbar}>
            <TouchableHighlight onPress={() => this.props.navigation.navigate('SelectGender', {phoneNumber: phoneNumber})}>
                <Icon name="arrow-back" size={30}/>
            </TouchableHighlight>
            
            <Text style={styles.navbarText}>Add Your First Name</Text>
          </View>
          <View style={styles.containInput}>
            <InputGroup borderType='underline'>
                <Input placeholder='First Name'
                        onChangeText={this.handleNameFill} />
            </InputGroup>
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
  containInput: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }

})