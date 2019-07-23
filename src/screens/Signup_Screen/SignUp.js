import { Container, Item, Form, Input, Button, Label, Spinner, InputGroup } from "native-base";
import React, { Component } from 'react';

import { StyleSheet, Text, TouchableHighlight, View, Image } from 'react-native';

import Firebase from '../../../utils/Config';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default class LoginScreen extends Component {

  state = { email: '', password: '', errorMessage: null, loading: false }

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


  render() {
    const loadingState = this.state.loading ? (
      <Spinner color="red" />
    ) : (
        <Text style={{ color: '#202020' }}>It works fine</Text>
      )
      
    return (
      <Container style={styles.container}>
        {loadingState}

        <View style={{ padding: 20 }}>
            <Image source={require('../../../assets/images/bored2.png')} style={{ height: 140, width: 310 }} />
        </View>

        {
          this.state.errorMessage &&
          <View style={{flexDirection: 'row', justifyContent: 'center', alignSelf: 'center'}}>
            <Icon name="cancel" style={{color: 'red', fontSize: 18}}/>
            <Text style={{color: 'red', fontSize: 17, marginLeft: 10}}>{this.state.errorMessage}</Text>
          </View>
        }

        <View style={styles.containerForms}>
          <InputGroup borderType='rounded' style={styles.inputGroupStyle} >
            <Input
              placeholder='Email'
              stle={styles.inputStyle}
              onChangeText={email => this.setState({ email })}
              value={this.state.email} />
          </InputGroup>
          <InputGroup borderType='rounded' style={styles.inputGroupStyle} >
            <Input
              secureTextEntry={true}
              placeholder='Password'
              stle={styles.inputStyle}
              onChangeText={password => this.setState({ password })}
              value={this.state.password} />
          </InputGroup>
        </View>

        <Form style={{ margin: 20 }}>
          <Button full bordered style={styles.buttonContainer} onPress={this.signUp}>
            <Text style={styles.styleSignUp}>SignUp</Text>
          </Button>
          <Button full bordered style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.styleSignUp}>Already User, Login here</Text>
          </Button>
        </Form>
      </Container>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020"
  },
  buttonContainer: {
    color: '#e8e1e1',
    borderColor: '#fff',
    borderRadius: 20,
    marginBottom: 15
  },
  styleSignUp: {
    color: '#e8e1e1',
    fontSize: 18,
    fontWeight: 'bold'
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e8e1e1',
    marginTop: 20
  },
  inputGroupStyle: {
    backgroundColor: '#e8e1e1',
    marginTop: 30,
    borderRadius: 20
  },
  inputStyle: {
    color: 'white',
    borderColor: '#e8e1e1'
  },
  containerForms: {
    margin: 20
  }

});