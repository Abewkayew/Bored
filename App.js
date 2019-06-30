/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons'; 


import { AppContainer } from './utils/AllNavigations'
import firebase from 'firebase';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


type Props = {};
export default class App extends Component<Props> {
  
  render() {
    return <AppContainer/>
    //  (
      // <View style={styles.container}>
      //   <Text style={styles.welcome}>Fun App for Bored PPL</Text>
      //   <Text style={styles.instructions}>To get started, edit App.js</Text>
      //   <Text style={styles.instructions}>{instructions}</Text>

      //   <Text>Native Base Checkup</Text>
      //     <TouchableHighlight>
      //       <Button bordered={true} style={styles.clickButtonStyle} full >
      //         <Text>Login with Facebook</Text>
      //       </Button>
      //     </TouchableHighlight>
      //       <TouchableHighlight>
      //         <Icon name='search' size={25}/>
      //       </TouchableHighlight>
           

      // </View>
        // {/* <Activities/>   */}
        // <People/>
        // <Profile/>
        // <Invitation/>
        // <ChatContainer/>
        // <SingleChat/>

        // );
  }
}

// const styles = StyleSheet.create({
//   // container: {
//   //   flex: 1,
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   //   backgroundColor: '#F5FCFF',
//   // },
//   clickButtonStyle: {
//     padding: 30,
//     margin: 10,
//     justifyContent: 'space-evenly'
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
