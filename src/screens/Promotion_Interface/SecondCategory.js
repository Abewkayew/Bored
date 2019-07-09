import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";
import { Button } from "native-base";



class SecondCategory extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <View style={{ flex: 2 }}>
                        <Image source={this.props.imageUri}
                            style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }}
                        />
                    </View>
                </View>
                <View style={styles.styleContainer}>
                    <Text style={styles.textStyle}>?Vamous a probar algo?</Text>
                    <View style={styles.styleInvita}>
                        <Button rounded style={styles.buttonContainer}>
                            <Text style={styles.styleText}>Enviar invitacion</Text>
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
}
export default SecondCategory;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      marginBottom: 10  
    },
    styleContainer: {
        marginLeft: 10
    },
    styleInvita: {
      width: 100, 
      height: 60,
      overflow: 'hidden',
      marginTop: 10,
      padding: 5,
      justifyContent: 'center'
    },
    styleText: {
      color: 'white',
      fontWeight: 'bold'
    },  
    imageContainer: {
        height: 130,
        width: 170, 
        marginRight: 5, 
        overflow: 'hidden', 
        borderColor: '#dddddd', 
        borderRadius: 20, 
        borderWidth: 2
    },
    buttonContainer: {
        backgroundColor: '#7eadf7',
        padding: 10
    }
});