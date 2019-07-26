import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight}  from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Dialog, { DialogFooter, DialogButton, DialogContent, SlideAnimation, DialogTitle} from 'react-native-popup-dialog';

import moment from "moment";
import Firebase from '../../../utils/Config';

import {formatTime} from '../../../utils/getTimeAgo'
import TimeAgo from 'react-native-timeago';
import firebase from 'firebase'



export default class Activities extends Component{

    constructor(props){
        super(props);

        this.state = { currentCount: 3600, currentUser: null, currentTime: moment(), endTime: moment().add(180, 'seconds'), 
                       timeRemaining: 36000, activityName: '', loading: false, startTime: "a few seconds ago",
                       gameCount: 0, drinkCount: 0, playCount: 0, theatreCount: 0, coffeeCount: 0, foodCount: 0, 
                       countActivity: 0, activities: [], visible: false, minutesLeft: 0, isFullTime: false
                    }
        this.handleActivityClick = this.handleActivityClick.bind(this);
        this.dbRef = Firebase.database().ref()
        console.disableYellowBox = true;             
    }

    handleTest = () => {
        alert("Game is clicked");
    }

    insertData = (actName) => {
        
        const {currentUser} = this.state;
        const newActivity = this.dbRef.child('activities/' + actName + '/users/' + currentUser.uid);

        const userActs = this.dbRef.child('users/' + currentUser.uid + '/activities/' + actName)

        const activityStartTime = firebase.database.ServerValue.TIMESTAMP
        const that = this;
        
        this.setState({loading: true})
        const activityData = {
            startTime : activityStartTime
        }

        const timeDelayed = formatTime(activityData.startTime)
        // insert activities
        const actsData = []
        newActivity.set(activityData).then(data => {
            actsData.push(data)
            that.setState({loading: false, startTime: timeDelayed})
            that.props.navigation.navigate('People', {activityName: actName})                              
            }).catch(error => {
            alert("Error happened: ", error)
        })
        
    }


    handleActivityClick(actName){

        const {currentUser, } = this.state;

        const userData = this.dbRef.child('users/' + currentUser.uid)
        const userActs = userData.child('activities')

        const  userActivity = userActs.child(actName)

        const activityName = {
            activityName: actName
        }

        let that = this;
        
        userActs.once('value', snapshot => {
            const data = snapshot.val()
            const countTotal = snapshot.numChildren()
            if(data){
                const actKeys = Object.keys(data)
            }
            
            if(countTotal < 2){
                that.setState({countActivity: countTotal})
                userActivity.set(activityName)
                // this.intervalId = setInterval(() => {
                // }, 2000);
                that.insertData(actName)
                
            }else{
                // check if the activity name exists inside the userNode/Activities/actName
                
                let peoples = [];
                snapshot.forEach(data => {
                    let person = {
                        acName: data.key
                    }
                    peoples.push(person);
                });

                let actExists = false

                for (var i = 0; i < peoples.length; i++) {
                    if(actName ==peoples[i].acName){
                        actExists = true
                        that.setState({isFullTime: true})
        
                    }
                }                
                if(actExists === true){
                    if(this.state.loading === false){
                        this.setState({isFullTime: true})
                        that.props.navigation.navigate('People', {activityName: actName})
                    }
                }else{
                    // const {activities} = this.state
                    const timeLeft = []
                    for (var j = 0; j < this.state.activities.length; j++){
                        const timeSpent = this.state.activities[j].timeSpent
                        // console.log("Details are: ", this.state.activities[j].timeSpent)
                        timeLeft.push(timeSpent) 
                    }

                    const minTimeLeft = Math.min(...timeLeft)
                    const diff = 60 - minTimeLeft
                    const diffSeconds = diff % 60
                    const seconds = Math.ceil(diffSeconds)
                    // alert("You have 00:" + diff + ":" + seconds)
                    this.setState({ visible: true, minutesLeft: diff });

                }
               
            }
        })
    }

    componentWillUnmount() {
        this.dbRef.off()
    }

    componentDidMount(){
        const {currentUser} = Firebase.auth();
        const userActs = this.dbRef.child('users/' + currentUser.uid + '/activities')

        userActs.once('value', snapshot => {
            const dataExists = snapshot.exists()
            if(dataExists){
                let acts = [];
                snapshot.forEach(data => {
                    let act = {
                        acName: data.key
                    }
                    acts.push(act);
                });

                this.intervalId = setInterval(() => {
                const activityDetails = []
                for (var i = 0; i < acts.length; i++) {
                    // alert("Activity Name is: " + acts[i].acName)
                    const actNames = acts[i].acName
                    const actDatas = this.dbRef.child('activities/' + actNames + '/users/' + currentUser.uid);
                    
                        actDatas.once('value', dataSnapshot => {
                            const data = dataSnapshot.val()
                            if(data){
                                const spentTime = data.startTime
                                const timeDelayed = formatTime(spentTime)

                                if(timeDelayed > 59){
                                    actDatas.remove()
                                    userActs.remove()

                                }

                                const actDetails = {
                                    activityName: actNames,
                                    timeSpent: timeDelayed
                                }
                                activityDetails.push(actDetails)
                            }
                    
                        })
                    
                }
                this.setState({activities: activityDetails})
            }, 500)

            }

        })

        // asdfasdf



        this.setState(
            {currentUser: currentUser,
             currentTime: moment()
            });
        this.countTotalUsers(currentUser.uid)
        // this.intervalId = setInterval(this.handleActivityClick, 10000);
        
    }

    countTotalUsers = (currentUserID) => {
        const activityNames = {
            game: 'game',
            drink: 'bar',
            theatre: 'movie_theater',
            play: 'gym',
            food: 'restaurant',
            coffee: 'cafe'
        }
        
        const totalGameUsers = this.dbRef.child('activities/' + activityNames.game + '/users');
        const totalDrinkUsers = this.dbRef.child('activities/' + activityNames.drink + '/users');
        const totalTheatreUsers = this.dbRef.child('activities/' + activityNames.theatre + '/users');
        const totalPlayUsers = this.dbRef.child('activities/' + activityNames.play + '/users');
        const totalFoodUsers = this.dbRef.child('activities/' + activityNames.food + '/users');
        const totalCoffeeUsers = this.dbRef.child('activities/' + activityNames.coffee + '/users');
        
        totalGameUsers.on('value', snapShot => {
            const countTotal = snapShot.numChildren()
            let users = [];
            snapShot.forEach(data => {
                let person = {
                    userKey: data.key
                }
                users.push(person);
            });

            for (var i = 0; i < users.length; i++) {
                if(currentUserID != users[i].userKey){
                    this.setState({
                        gameCount: countTotal - 1 
                    })
                }
            }

        
        })

        totalDrinkUsers.on('value', snapShot => {
            const countTotal = snapShot.numChildren()

            let users = [];
            snapShot.forEach(data => {
                let person = {
                    userKey: data.key
                }
                users.push(person);
            });

            for (var i = 0; i < users.length; i++) {
                if(currentUserID != users[i].userKey){
                    this.setState({
                        drinkCount: countTotal - 1
                    })
                }
            }
           
        
        })

        totalTheatreUsers.on('value', snapShot => {
            const countTotal = snapShot.numChildren()
            
            let users = [];
            snapShot.forEach(data => {
                let person = {
                    userKey: data.key
                }
                users.push(person);
            });

            for (var i = 0; i < users.length; i++) {
                if(currentUserID != users[i].userKey){
                    this.setState({
                        theatreCount: countTotal - 1
                    })
                }
            } 
        
        })

        totalPlayUsers.on('value', snapShot => {
            const countTotal = snapShot.numChildren()

           
            let users = [];
            snapShot.forEach(data => {
                let person = {
                    userKey: data.key
                }
                users.push(person);
            });

            for (var i = 0; i < users.length; i++) {
                if(currentUserID != users[i].userKey){
                    this.setState({
                        playCount: countTotal - 1
                    })
                }
            }       
        })

        totalFoodUsers.on('value', snapShot => {
            const countTotal = snapShot.numChildren()
            let users = [];
            snapShot.forEach(data => {
                let person = {
                    userKey: data.key
                }
                users.push(person);
            })
            for (var i = 0; i < users.length; i++) {
                if(currentUserID != users[i].userKey){
                    this.setState({
                        foodCount: countTotal - 1
                    })
                }
            }            
           
        
        })

        totalCoffeeUsers.on('value', snapShot => {
            const countTotal = snapShot.numChildren()
            
               
            let users = [];
            snapShot.forEach(data => {
                let person = {
                    userKey: data.key
                }
                users.push(person);
            });

            for (var i = 0; i < users.length; i++) {
                if(currentUserID != users[i].userKey){
                    this.setState({
                        coffeeCount: countTotal - 1
                    })
                }
            }  
        
        })

    }
    
    render(){

        const {loading, visible, minutesLeft, isFullTime} = this.state;
        
        return(
            <View style={styles.container}>
            <Dialog
                visible={visible}
                width={0.8}
                onTouchOutside={() => {
                this.setState({ visible: false });
                }}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                  })}
                dialogTitle={<DialogTitle title="Time left indicator" />}
                footer={
                    <DialogFooter>
                      <DialogButton
                        style={{color: 'red'}}
                        text="Dismiss"
                        onPress={() => {this.setState({visible: false})}}
                      />
                    </DialogFooter>
                  }  
                >
                <DialogContent>
                    
                        {
                            minutesLeft > 0 ? (
                                <View>
                                    <Text style={styles.dialogContentTextStyle}><Text style={{color: 'red'}}>{minutesLeft}</Text> minutes left to go to next activity</Text>
                                </View>
                            ): (
                                <View>
                                    <Text style={styles.dialogContentTextStyle}>Few seconds left to go to next Activity</Text>
                                </View>
                            )
                        }
                </DialogContent>
            </Dialog>

                        <ScrollView>
                        {/*  Navigation bar*/}
                        <View style={styles.navigationBar} elevation={20}>
                            <TouchableHighlight onPress={() => this.props.navigation.navigate('MyProfile')} style={styles.navigationItems}>
                                {/* <Icon name="account-circle" style={{fontSize: 35, color: '#1f1f14'}} /> */}
                                <Image
                                    source={require('../../../assets/images/man_2.png')}
                                    style={{width: 35, height: 40}}
                                />
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.navigationItems} onPress={() => this.props.navigation.navigate('Activity')}>
                                <Icon name="mood" style={{fontSize: 40, color: '#4DDFE5'}}/>
                            </TouchableHighlight>
                            <View style={styles.navigationItems}>
                                <TouchableHighlight onPress={() => this.props.navigation.navigate('ChatContainer')}>
                                   <Image 
                                    source={require('../../../assets/images/message_single_two.png')}
                                    style={{width: 40, height: 40}}
                                   />
                                </TouchableHighlight>
                                <Button  
                                    rounded style={{top: -15, left: 15, backgroundColor: '#4DDFE5',
                                    padding: 5, width: 20, height: 20, alignContent: 'center'}}>
                                    <Text style={{color: 'white'}}>2</Text>
                                </Button>
                            </View>
                        </View>
                        <View style={styles.shadowStyle}></View>
                        <View style={styles.displayAllcards}>
                        <Text style={styles.textTitle}>What would you like to do?</Text>
                        <Text style={{alignContent: 'center',  fontSize: 18, marginTop: 15,
                                marginHorizontal: 40}}>
                           Choose your favorite activity and find people who want the same!
                        </Text>

                        {
                          loading ? (
                              <View style={{justifyContent:'center', flexDirection: 'row'}}>
                                <Spinner color="#21CEFF"/> 
                                 <View style={{marginLeft: 10, marginTop: 10}}>
                                     <Text style={{color: '#21CEFF', fontSize: 18, fontWeight: 'bold'}}>Connecting...</Text>  
                                 </View>
                              </View>
                            ):(
                            <Text style={{color: 'white'}}>''</Text>
                        )
                        }

                        <View style={styles.displayActivities}>
                            <View style={styles.displayEachActivities}>
                                <View style={styles.containSingleActivity} elevation={5}>
                                    <Text style={{alignSelf: 'center', fontSize: 17, fontWeight: '500', marginBottom: 5}}>Go for a coffee</Text>
                                    <TouchableHighlight 
                                        onPress={() => this.handleActivityClick('cafe')}
                                        style={styles.imageContainer}
                                        >
                                     <Image source={require('../../../assets/images/ico_cafe.jpg')} style={{height: 150, width: 150}}/>
                                    </TouchableHighlight>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                                        <Icon name="account-circle" style={{fontSize: 24}}/>
                                            <Text style={{fontSize: 18, marginLeft: 5}}>
                                                {
                                                    this.state.coffeeCount
                                                }
                                            </Text>
                                    </View>
                                </View>
                                <View style={styles.containSingleActivity}>
                                    <Text style={{alignSelf: 'center', fontSize: 17, fontWeight: '500', marginBottom: 5}}>Watch a movie</Text>
                                    <TouchableHighlight 
                                        onPress={() => this.handleActivityClick('movie_theater')}
                                        style={styles.imageContainer}
                                        >
                                    <Image source={require('../../../assets/images/ico_teatro.jpg')} style={{height: 150, width: 150}}/>
                                    </TouchableHighlight>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                                        <Icon name="account-circle" style={{fontSize: 24}}/>
                                        <Text style={{fontSize: 18, marginLeft: 5}}>
                                            {
                                                this.state.theatreCount
                                            }
                                        </Text>
                                    </View>
                                </View>                                                                        
                            </View>
    
                                            {/* second card view  */}

                        <View style={styles.displayEachActivities}>
                                <View style={styles.containSingleActivity}>
                                    <Text style={{alignSelf: 'center', fontSize: 17, fontWeight: '500', marginBottom: 5}}>Go for a drink</Text>
                                    <TouchableHighlight 
                                        onPress={() => this.handleActivityClick('bar')}
                                        style={styles.imageContainer}
                                        >
                                        <Image source={require('../../../assets/images/ico_chela.jpg')} style={{height: 120, width: 150}}/>                                          
                                    </TouchableHighlight>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                                        <Icon name="account-circle" style={{fontSize: 24}}/>
                                        <Text style={{fontSize:18, marginLeft: 5}}>
                                            {
                                                this.state.drinkCount
                                            }
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.containSingleActivity}>
                                    <Text style={{alignSelf: 'center', fontSize: 17, fontWeight: '500', marginBottom: 5}}>Go to eat</Text>
                                        <TouchableHighlight 
                                            onPress={() => this.handleActivityClick('restaurant')}
                                            style={styles.imageContainer}
                                            >
                                    <Image source={require('../../../assets/images/ico_restaurante.jpg')} style={{height: 120, width: 150}}/>
                                        
                                    </TouchableHighlight>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                                        <Icon name="account-circle" style={{fontSize: 24}}/>
                                        <Text style={{fontSize: 18, marginLeft: 5}}>
                                            {
                                                this.state.foodCount
                                            }
                                        </Text>
                                    </View>
                                </View>                                                                        
                            </View>

            
                        </View>
                        
                        
                        {/* end container */}
                         </View>
    
                            {/* end activity chooser */}
    
                    </ScrollView>
    

               
            </View>    

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    navigationBar: {
         height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        elevation: 2
    },
    shadowStyle: {
        marginBottom: 30,
        height: 1,
        backgroundColor: '#d6d6c2'
    },
    navigationItems: {
        marginVertical: 15
    },
    imageContainer: {
        height: 150,
        overflow: 'hidden',
        borderColor: '#dddddd',
        borderRadius: 20,
        borderWidth: 1,
        alignSelf: 'center'
    },
    containSingleActivity:{
        marginVertical: 15, 
        marginHorizontal: 10,
    },
    logoImage: {
        flex: 1,
    },
    displayAllcards: {
        flex: 1,
        flexDirection: 'column'
    },
    textTitle: {
        color: '#4DDFE5',
        justifyContent: 'center',
        marginLeft: 20,
        fontWeight: 'bold',
        fontSize: 23,
    },
    displayActivities: {
        marginTop: 3,
        marginRight: 5,
        marginLeft: 5,
        paddingBottom: 50
    },
    displayEachActivities: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 200,
        paddingTop: 20,
        borderRadius: 10,
        marginVertical: 15
    },
    dialogContentTextStyle: {
        fontSize: 18, 
        fontWeight: 'bold'
    }
});