import {CheckBox, Input, Button, DatePicker, InputGroup } from "native-base";
import React, { Component } from 'react';

import { StyleSheet, Text, TouchableHighlight, View, Image, TouchableOpacity } from 'react-native';
import Firebase from '../../../utils/Config';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { LoginButton, AccessToken,  LoginManager } from 'react-native-fbsdk'

export default class AddBestPicture extends Component {

    constructor(props){
        super(props);
        this.state = {
            clicked: false
        }

        this.handleOnclick = this.handleOnclick.bind(this)

      }

    handleOnclick(){
        this.setState({
            clicked: true
        })
    }

    

    storeGenderSelection = () => {

    }


  render() {

    return (
      <View style={styles.container}>
          <View style={styles.containNavbar}>
            <TouchableHighlight onPress={() => this.props.navigation.navigate('AddDetails')}>
                <Icon name="arrow-back" size={30}/>
            </TouchableHighlight>
            <Text style={styles.navbarText}>Add Your Best Picture</Text>
          </View>
          <View style={styles.containInput}>
             <TouchableOpacity onPress={() => this.props.navigation.navigate('SelectSource')}>
              <Image 
                  source={require('../../../assets/images/modifiedaddprofile.png')}
                  style={{width: 250, height: 320}}
                  />
             </TouchableOpacity>
                           
          </View>
          <View style={styles.containButton}>
            <Button rounded transparent info 
                    onPress={() => this.props.navigation.navigate('SelectSource')}
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
    marginVertical: 50,
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