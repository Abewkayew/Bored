import { Container, Item, Form, Input, Button, Label, Spinner, InputGroup } from "native-base";
import React, { Component } from 'react';

import { StyleSheet, Text, TouchableHighlight, View, Image } from 'react-native';

import Firebase from '../../../utils/Config';

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
   if(email.length > 2 && password.length > 2){
      Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        that.setState({
          loading: false
        })
        that.props.navigation.navigate('CreateProfile')
      })
      .catch(error => that.setState({ errorMessage: error.message }))
   }else{
     alert("Incorrect length of password and email address")
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

        {
          this.state.errorMessage &&
          <Text>{this.state.errorMessage}</Text>
        }

        <View style={{ padding: 20 }}>
          <View style={{ padding: 10 }}>
            <Image source={require('../../../assets/images/bored2.png')} style={{ height: 140, width: 310 }} />
          </View>
        </View>


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
          {/* <TouchableHighlight onPress={() => this.props.navigation.navigate('Login')}>
                          <Text style = {styles.loginText}>Already User, Login here</Text>
                      </TouchableHighlight> */}
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
    borderRadius: 20
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