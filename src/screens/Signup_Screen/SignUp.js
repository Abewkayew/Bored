import { Container, Item, Form, Input, Button, Label, Spinner} from "native-base";
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';


import Firebase from '../../../utils/Config';

export default class LoginScreen extends Component{
    
    state = { email: '', password: '', errorMessage: null, loading: false }

    signUp = () => {
        this.setState({
          loading: true
      })

        //Firebase Logic to SignUp the user goes here...
      Firebase.auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({
          loading: false
        })
        this.props.navigation.navigate('CreateProfile')
      })
      .catch(error => this.setState({ errorMessage: error.message }))
    } 

    
    render() {
      const loadingState = this.state.loading ? (
              <Spinner color="red"/>
            ) : (
               <Text>Signup is working</Text>
            )


        return (
              <Container style={styles.container}>
                    {loadingState}

                    {
                        this.state.errorMessage && 
                        <Text>{this.state.errorMessage}</Text>
                    }
                    <Form>
                      <Item floatingLabel>
                        <Label>Email</Label>
                        <Input 
                            autoCapitalize="none" 
                            autoCorrect={false}
                            onChangeText = {email => this.setState({ email })}
                            value ={this.state.email} />
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
                        <Button full bordered style={styles.buttonContainer} onPress={this.signUp}>
                            <Text>SignUp</Text>
                        </Button>
                      </TouchableHighlight>
                      <TouchableHighlight onPress={() => this.props.navigation.navigate('Login')}>
                          <Text style = {styles.signUpText}>Already User, Login here</Text>
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