import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'


import Firebase from '../../../utils/Config';

export default class Loading extends React.Component {
  
  componentDidMount() {
    const userDatabaseReference = Firebase.database().ref().child('users/');
        
    Firebase.auth().onAuthStateChanged(user => {
        if(user){
            let currentUserDB = userDatabaseReference.child(user.uid)
            currentUserDB.on('value', (snapShot) => {
              let exists = snapShot.exists()  
              if(exists){
                this.props.navigation.navigate('Activity')
                }
              else{
                this.props.navigation.navigate('CreateProfile')
              }
            })
        }else{
          this.props.navigation.navigate('SignUp')  
        }
      })
  }
  
    render() {
    return (
      <View style={styles.container}>
          <Text style={{color:'#e93766', fontSize: 40}}>Loading</Text>
          <ActivityIndicator color='#e93766' size="large" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  }
})