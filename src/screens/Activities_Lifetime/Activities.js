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
                       countActivity: 0, activities: [], visible: false, minutesLeft: 0
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
                console.log("ActKeys: ", actKeys)

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
                    }
                }                
                if(actExists === true){
                    if(this.state.loading === false){
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
            });

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

        const {activities, loading, visible, minutesLeft} = this.state;

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
                        <View style={styles.navigationBar}>
                            <TouchableHighlight onPress={() => this.props.navigation.navigate('MyProfile')}>
                                <Image source={require('../../../assets/images/dots.png')} style={{width: 98, height: 30}}
                                onPress={() => alert('It works')} />
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => this.props.navigation.navigate('ChatContainer')}>
                                <Icon name="message" style={{fontSize: 30, color: 'white'}}/>
                            </TouchableHighlight>
                        </View>

                        <View style={{padding: 20}}>
                            {/* Logo Image*/}

                            <View style={{padding: 10}}>
                                <Image  source={require('../../../assets/images/bored2.png')} style={{height: 140,  width: 310 }}/>
                            </View>
                        </View>
                        {/* begin activity chooser */}

                        <View style={styles.displayAllcards}>
                        <Text style={styles.textTitle}>Tendencias de la Zona</Text>
                        <Text style={{color: 'white', alignContent: 'center',  fontSize: 16, marginTop: 5,
                                marginLeft: 20, marginRight: 20}}>!Elige tu actividad favorita y encuentra 
                        gente que busca lo mismo!</Text>
                    
                        {
                          loading ? (
                            <Spinner color="red" />
                            ):(
                            <Text>''</Text>
                        )
                        }

                        <View style={styles.displayActivities}>
                            <View style={styles.displayEachActivities}>
                                
                                <TouchableHighlight onPress={() => this.handleActivityClick('game')}>
                                    <Card>
                                        <CardItem cardBody bordered>
                                                <Image source={require('../../../assets/images/ico_game.jpg')} style={{height: 120, width: 150}}/>
                                        </CardItem>
                                        <CardItem bordered>
                                        <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                            <Icon name="account-circle" style={{fontSize: 24}}/>
                                            <Text style={{fontSize:18, marginLeft: 5}}>
                                               {
                                                   this.state.gameCount
                                               }
                                            </Text>
                                        </Body>
                                        </CardItem>
                                    </Card>
                                </TouchableHighlight>
    
                                <TouchableHighlight onPress={() => this.handleActivityClick('movie_theater')}>
                                    <Card>
                                        <CardItem cardBody bordered>
                                            <Image source={require('../../../assets/images/ico_teatro.jpg')} style={{height: 120, width: 150}}/>
                                        </CardItem>
                                        <CardItem bordered>
                                        <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                            <Icon name="account-circle" style={{fontSize: 24}}/>
                                            <Text style={{fontSize: 18, marginLeft: 5}}>
                                                {
                                                    this.state.theatreCount
                                                }
                                            </Text>
                                        </Body>
                                        </CardItem>
                                    </Card>
                                </TouchableHighlight>
    
    
                            </View>
    
                                    {/* Second Card View */}
    
                        <View style={styles.displayEachActivities}>
                                {/* <Text style={{color: 'white'}}>Left Side</Text>
                                <Text style={{color: 'white'}}>Right Side</Text> */}
                                
                            <TouchableHighlight onPress={() => this.handleActivityClick('bar')}>
                                    <Card>
                                        <CardItem cardBody bordered>
                                            <Image source={require('../../../assets/images/ico_chela.jpg')} style={{height: 120, width: 150}}/>
                                        </CardItem>
                                        <CardItem bordered>
                                        <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                            <Icon name="account-circle" style={{fontSize: 24}}/>
                                            <Text style={{fontSize: 18, marginLeft: 5}}>
                                                {
                                                    this.state.drinkCount
                                                }
                                            </Text>
                                        </Body>
                                        </CardItem>
                                    </Card>
                            </TouchableHighlight>
    
                            <TouchableHighlight onPress={() => this.handleActivityClick('gym')}>
                                    <Card>
                                        <CardItem cardBody bordered>
                                            <Image source={require('../../../assets/images/ico_deporte.jpg')} style={{height: 120, width: 150}}/>
                                        </CardItem>
                                        <CardItem bordered>
                                        <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                            <Icon name="account-circle" style={{fontSize: 24}}/>
                                            <Text style={{fontSize: 18, marginLeft: 5}}>
                                                {
                                                    this.state.playCount
                                                }
                                            </Text>
                                        </Body>
                                        </CardItem>
                                    </Card>
                            </TouchableHighlight>
    
                            </View>
    
                            <View style={styles.displayEachActivities}>
                                {/* <Text style={{color: 'white'}}>Left Side</Text>
                                <Text style={{color: 'white'}}>Right Side</Text> */}
                                
                                
                                <TouchableHighlight onPress={() => this.handleActivityClick('cafe')}>
                                    <Card>
                                        <CardItem cardBody bordered>
                                            <Image source={require('../../../assets/images/ico_cafe.jpg')} style={{height: 120, width: 150}}/>
                                        </CardItem>
                                        <CardItem bordered>
                                        <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                            <Icon name="account-circle" style={{fontSize: 24}}/>
                                            <Text style={{fontSize: 18, marginLeft: 5}}>
                                                {
                                                    this.state.coffeeCount
                                                }
                                            </Text>
                                        </Body>
                                        </CardItem>
                                    </Card>
                                </TouchableHighlight>
    
                                <TouchableHighlight onPress={() => this.handleActivityClick('restaurant')}>
                                    <Card>
                                        <CardItem cardBody bordered>
                                            <Image source={require('../../../assets/images/ico_restaurante.jpg')} style={{height: 120, width: 150}}/>
                                        </CardItem>
                                        <CardItem bordered>
                                        <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                            <Icon name="account-circle" style={{fontSize: 24}}/>
                                            <Text style={{fontSize: 18, marginLeft: 5}}>
                                                {
                                                    this.state.foodCount
                                                }
                                            </Text>
                                        </Body>
                                        </CardItem>
                                    </Card>
                                    </TouchableHighlight>
    
                                </View>
                                
                                </View>
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
        backgroundColor: '#202020'
    },
    navigationBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 46,
        elevation: 10,
        padding: 10,

        // backgroundColor:'red'
    },
    logoImage: {
        flex: 1,
    },
    displayAllcards: {
        flex: 1,
        flexDirection: 'column'
    },
    textTitle: {
        color: 'white',
        justifyContent: 'center',
        marginLeft: 20,
        fontWeight: 'bold',
        fontSize: 23,
    },
    displayActivities: {
        flex: 1,
        marginTop: 3,
        marginRight: 5,
        marginLeft: 5
    },
    displayEachActivities: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 200,
        paddingTop: 20,
        borderRadius: 10
    },
    dialogContentTextStyle: {
        fontSize: 18, 
        fontWeight: 'bold'
    }
});