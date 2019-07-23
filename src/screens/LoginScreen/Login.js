import { Container, Item, Form, Input, Button, Label } from "native-base";
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';

import Firebase from '../../../utils/Config';

export default class LoginScreen extends Component{

    constructor(props){
      super(props)
      this.state = {email: '', 
               password: '', 
               errorMessage: null
             }
    }
    
    login = () => {
      // Login logic for Firebase goes here
      Firebase
     .auth()
     .signInWithEmailAndPassword(this.state.email, this.state.password)
     .then(() => this.props.navigation.navigate('Activity'))
     .catch(error => this.setState({ errorMessage: error.message }))
    }

    handleEmailAddress = (userEmail) => {
        this.setState({
          email: userEmail
        })
    }
    handlePassword = (userPassword) => {
        this.setState({
          password: userPassword
        })
    }

    render() {
        return (
          <Container style={styles.container}>
            <Form>
              <Item floatingLabel>
                <Label>Email</Label>
                <Input 
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={this.handleEmailAddress}
                    value={this.state.email} />
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={this.handlePassword}
                  value={this.state.password}
                />
              </Item>
                <Button full bordered style={styles.buttonContainer}  onPress={this.login}>
                    <Text>SignIn</Text>
                </Button>
              <TouchableHighlight onPress={() => this.props.navigation.navigate('SignUp')}>
                  <Text style = {styles.signUpText}>New User? Sign Up here</Text>
              </TouchableHighlight>
            </Form>
          </Container>
        );
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        // alignItems: "center",
        justifyContent: "center"
      },
      buttonContainer: {
          margin: 10
        },
      signUpText: {
          fontSize: 20,
          fontWeight: 'bold'
      }
});