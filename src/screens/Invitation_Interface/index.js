<ScrollView>
<View style={styles.tabViewStyle}>
    <TouchableHighlight>
        <Button onPress={() => this.props.navigation.navigate('People')}
                bordered light style={{width: 150, justifyContent: 'center'}}>
            <Text style={{color: 'white'}}>personas</Text>
        </Button>
    </TouchableHighlight>

   <TouchableHighlight>
        <Button onPress={() => this.props.navigation.navigate('Invitation')}
                bordered light style={{width: 150, justifyContent: 'center'}}>
            <Text style={{color: 'white'}}>invitaciones</Text>
        </Button>
   </TouchableHighlight>

</View>

{/* Just for checking the Image Horizontal Scroller...*/}

<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#fff'}}>
        <View
        // this will bound the size of the ScrollView to be a square because
        // by default, it will expand regardless if it has a flex value or not
        style={{ width, height: width }}
        >
        <ScrollView
            horizontal={true}
            pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
            showsHorizontalScrollIndicator={false}
            // the onScroll prop will pass a nativeEvent object to a function
            onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
            [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
            )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
            scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
            >
                <TouchableHighlight onPress={this.props.navigation.navigate('People')}>
                    <ImageOverlay
                    source={require('../../../assets/images/location_invite/1.jpg')}
                    style={{width, height: width}}
                    overlay='cyan'
                    contentPosition='bottom'>
                            
                    </ImageOverlay>    
                </TouchableHighlight>
                
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Text style={{fontSize: 16, fontWeight:'bold'}}>Cineplanet esta` a 30m</Text>
                    
                </View>
        </View>
        
</View>


{/* End of the Image Scroll Example */}




<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#fff'}}>
        <View
        // this will bound the size of the ScrollView to be a square because
        // by default, it will expand regardless if it has a flex value or not
        style={{ width, height: width }}
        >
        <ScrollView
            horizontal={true}
            pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
            showsHorizontalScrollIndicator={false}
            // the onScroll prop will pass a nativeEvent object to a function
            onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
            [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
            )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
            scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
            >
            
                <ImageOverlay
                source={require('../../../assets/images/location_invite/2.jpg')}
                style={{width, height: width}}
                overlay='cyan'
                contentPosition='bottom'>
                    
            </ImageOverlay>  
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Text style={{fontSize: 16, fontWeight:'bold'}}>Cineplanet esta` a 30m</Text>
                    
                </View>
        </View>
        
</View>


<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#fff'}}>
        <View
        // this will bound the size of the ScrollView to be a square because
        // by default, it will expand regardless if it has a flex value or not
        style={{ width, height: width }}
        >
        <ScrollView
            horizontal={true}
            pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
            showsHorizontalScrollIndicator={false}
            // the onScroll prop will pass a nativeEvent object to a function
            onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
            [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
            )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
            scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
            >
               <ImageOverlay
                source={require('../../../assets/images/location_invite/3.jpg')}
                style={{width, height: width}}
                overlay='cyan'
                contentPosition='bottom'>
                    
            </ImageOverlay>  
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Text style={{fontSize: 16, fontWeight:'bold'}}>Cineplanet esta` a 30m</Text>
                    
                </View>
        </View>
        
</View>            

<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#fff'}}>
        <View
        // this will bound the size of the ScrollView to be a square because
        // by default, it will expand regardless if it has a flex value or not
        style={{ width, height: width }}
        >
        <ScrollView
            horizontal={true}
            pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
            showsHorizontalScrollIndicator={false}
            // the onScroll prop will pass a nativeEvent object to a function
            onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
            [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
            )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
            scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
            >
                <ImageOverlay
                source={require('../../../assets/images/location_invite/4.jpg')}
                style={{width, height: width}}
                overlay='cyan'
                contentPosition='bottom'>
                    
            </ImageOverlay>  
          
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Text style={{fontSize: 16, fontWeight:'bold'}}>Cineplanet esta` a 30m</Text>
                    
                </View>
        </View>
        
</View>
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#fff'}}>
        <View
        // this will bound the size of the ScrollView to be a square because
        // by default, it will expand regardless if it has a flex value or not
        style={{ width, height: width }}
        >
        <ScrollView
            horizontal={true}
            pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
            showsHorizontalScrollIndicator={false}
            // the onScroll prop will pass a nativeEvent object to a function
            onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
            [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
            )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
            scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
            >
                <ImageOverlay
                source={require('../../../assets/images/location_invite/5.jpg')}
                style={{width, height: width}}
                overlay='cyan'
                contentPosition='bottom'>
                    
            </ImageOverlay>  
       </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Text style={{fontSize: 16, fontWeight:'bold'}}>Cineplanet esta` a 30m</Text>
                    
                </View>
        </View>
        
</View>
</ScrollView>
