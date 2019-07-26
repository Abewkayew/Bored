          <View style={styles.containNextButton}>
            <Button rounded transparent info onPress={() => this.props.navigation.navigate('AddName')}
                style={{backgroundColor: '#4DDFE5', width: 150, justifyContent: 'center'}}>
                <Text style={{fontSize: 18, color: '#fff',
                    fontWeight: '500', marginLeft: 5, marginRight: 10}}>
                    Next
                </Text>
                <Icon name="arrow-forward" style={{color: 'white', fontSize: 30, fontWeight: '100'}}/>
            </Button>
          </View>
