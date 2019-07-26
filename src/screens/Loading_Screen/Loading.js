import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

import Firebase from '../../../utils/Config';

export default class Loading extends React.Component {

  constructor(props){
    super(props)
    console.disableYellowBox = true
    this.refDB = Firebase.database().ref()     
  }
  
  componentDidMount() {
    const userDatabaseReference = this.refDB.child('users')
    const that = this   
    Firebase.auth().onAuthStateChanged(user => {
        if(user){
            let currentUserDB = userDatabaseReference.child(user.uid)
              currentUserDB.on('value', (snapShot) => {

              const profileImageInfo = snapShot.child("ProfileImages")

              let exists = profileImageInfo.exists()

              if(exists){
                that.props.navigation.navigate('Activity')
                }else{
                that.props.navigation.navigate('AddBestPicture')
              }
            })
        }else{
          that.props.navigation.navigate('SignUp')
        }
      })
  }
  componentWillUnmount(){
    this.refDB.off()
  }
  
    render() {
    return (
      <View style={styles.container}>
          <Text style={{color:'#21CEFF', fontSize: 40}}>Loading...</Text>
          <ActivityIndicator color='#21CEFF' size="large" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }
})