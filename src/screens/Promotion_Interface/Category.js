import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";

class Category extends Component {
    render() {
        return (
            <View style={{width: 170, marginLeft: 5}}>
                <View style={styles.imageContainer}>
                    <Image source={this.props.imageUri}
                        style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }}
                    />
                </View>
                <View style={{ flex: 1, paddingLeft: 10, paddingTop: 10 }}>
                    <Text style={styles.promoText}>{this.props.text}</Text>
                </View>
            </View>
        )
    }
}
export default Category;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        flex: 2,
        height: 200,
        width: 160,
        marginRight: 5, 
        overflow: 'hidden', 
        borderColor: '#dddddd', 
        borderRadius: 20, 
        borderWidth: 2
    },
    promoText: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});