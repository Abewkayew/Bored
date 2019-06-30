import { Container, Item, Form, Input, Button, Label } from "native-base";
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';

import Firebase from '../../../utils/Config';

export default class LoginScreen extends Component{

    state = {email: '', password: '', errorMessage: null}
    
    login = () => {
      //Login logic for Firebase goes here
    //   Firebase
    //  .auth()
    //  .signInWithEmailAndPassword(email, password)
    //  .then(() => this.props.navigation.navigate('Activity'))
    //  .catch(error => this.setState({ errorMessage: error.message }))  
    alert("It works")
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
                    onChangeText={email => this.setState({email})}
                    value={this.state.email} />
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={password => this.setState({password})}
                  value={this.state.password}
                />
              </Item>
              <TouchableHighlight>
                <Button full bordered style={styles.buttonContainer} onPress={this.login}>
                    <Text>SignIn</Text>
                </Button>
              </TouchableHighlight>
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