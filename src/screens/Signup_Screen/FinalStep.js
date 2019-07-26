import { Container, Item, Form, Input, Button, Label, Spinner, InputGroup} from "native-base";
import React, { Component } from 'react';

import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';

import Firebase from '../../../utils/Config';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { LoginButton, AccessToken,  LoginManager } from 'react-native-fbsdk'

const { width, height } = Dimensions.get('window')


export default class FinalStep extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedMale: false,
            selectedFemale: false,
            meetMale: false,
            meetFemale: false,
            currentUser: null
        }

        const parameters = this.props.navigation.state.params        
        this.name = parameters.nombre
        this.birthDate = parameters.birthDate
        this.phone =   parameters.phone
        this.gender =parameters.gender
        this.wantToMeet = parameters.wantToMeet
        this.latitude = parameters.latitude
        this.longitude = parameters.longitude
        this.profileImageUrl = parameters.profileImageUrl
        
    }

    saveState = () => {
        const {currentUser} = this.state
        const name = this.name
        const birthDate = this.birthDate
        const phone = this.phone
        const gender = this.gender
        const wantToMeet = this.wantToMeet
        const latitude = this.latitude
        const longitude = this.longitude
        const profileImageUrl = this.profileImageUrl

        const dbPath = Firebase.database().ref().child('/users/' + currentUser.uid)  
        const that = this

        const dataObject = {
            nombre: name,
            birthDate: birthDate,
            phone: phone,
            gender: gender,
            wantToMeet: wantToMeet,
            latitude: latitude,
            longitude: longitude
        }

        const userImageUrl = {
            'profileImageUrl': profileImageUrl
        }
  
          this.setState({
              loading: true
          })

          let imagePath = dbPath.child('ProfileImages').push()

            dbPath.set(dataObject).then(() => {
            imagePath.set(userImageUrl).then(() => {
                that.setState({
                    loading: false
                })
                that.props.navigation.navigate('Activity')   
                })
            })

    }

    componentDidMount(){
        const {currentUser} = Firebase.auth();
        this.setState({
            currentUser: currentUser
        })
    }

  render() {

    return (
      <View style={styles.container}>
          <View style={styles.containInfo}>
              <View>
                  <Image 
                    source={require('../../../assets/images/modifiedeattogether.png')}
                    style={{width: 200, height: 200, alignSelf: 'center'}}
                  />
              </View>
              <Text style={styles.congratulationText}>Congratulations</Text>

          </View>
          <View style={styles.containInfo}>
            <View style={{justifyContent: 'space-between'}}>
                <View style={{paddingVertical: 10}}>
                    <Text style={styles.boredInfo}>In Bored you will find people who</Text> 
                    <Text style={{fontSize: 18, fontWeight: '400',marginLeft: 20}}>wants to do the same thing as </Text> 
                    <Text style={{fontSize: 18, fontWeight: '400', alignSelf: 'center'}}>you.</Text>
                </View>    
                <View style={{justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 18, fontWeight: '400'}}>Just choose your favorite activity.</Text>
                </View>

                <View style={{justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 18, fontWeight: '400'}}>Each activity you choose will be 
                        active for 60 min. And you may 
                        only have 2 active activities.
                    </Text>
                </View>
                
                <Text style={styles.textChooseWisely}>So choose wisely !</Text>
            </View>
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
    paddingVertical: 5,
    marginHorizontal: 30
  },
  containNextButton: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  congratulationText: {
     fontSize: 25, 
     fontWeight: '400',
     color: '#21CEFF',
     alignSelf: 'center'
  },
  containInfo: {
      flex: 1,
  },
  boredInfo: {
      fontSize: 18,
      fontWeight: '400',
  },
  textChooseWisely: {
    fontSize: 18,
    fontWeight: '400',
    textShadowColor: 'red',
    paddingVertical: 10,
    alignSelf: 'center'
  }
})