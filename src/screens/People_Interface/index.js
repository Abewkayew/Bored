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
                                        {/* {photos.map((source, i) => { // for every object in the photos array... */}
                                        {/* return ( // ... we will return a square Image with the corresponding object as the source */}
                                          <TouchableHighlight onPress={() => this.props.navigation.navigate('Profile', {actName: this.actName})}>
                                                <ImageOverlay
                                                    key={index}
                                                    source={data.profileImageUrl}
                                                    style={{width, height: width}}
                                                    overlay='cyan'
                                                    contentPosition='bottom'>
                                                        {/* <TouchableHighlight onPress={() => alert('Message works')}> */}
                                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                                            <Button rounded bordered onPress={() => this.props.navigation.navigate('SingleChat', {actName: this.actName})}
                                                                style={{width: 50,backgroundColor: '#fff',
                                                                    height: 50, justifyContent: 'center', borderColor: 'green'}}>
                                                                <Image source={require('../../../assets/images/messages.png')} style={{width: 30, height: 30}}/>
                                                            </Button>
                                                        </View>
                                                              
                                                        {/* </TouchableHighlight> */}
                                                 </ImageOverlay>  
                                           </TouchableHighlight>
                                        {/* ); */}
                                        {/* // })} */}
                                    </ScrollView>