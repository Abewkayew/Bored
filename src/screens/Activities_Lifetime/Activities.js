import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight}  from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from "moment";
import Firebase from '../../../utils/Config';

import {formatTime} from '../../../utils/getTimeAgo'
import TimeAgo from 'react-native-timeago';
import firebase from 'firebase'



export default class Activities extends Component{

    constructor(props){
        super(props);

        this.state = { currentCount: 3600, currentUser: null, currentTime: moment(), endTime: moment().add(180, 'seconds'), 
                       timeRemaining: 36000, activityName: '', loading: true, startTime: "a few seconds ago",
                       gameCount: 0, drinkCount: 0, playCount: 0, theatreCount: 0, coffeeCount: 0, foodCount: 0, 
                       countActivity: 0, activities: []
                    }
        this.handleActivityClick = this.handleActivityClick.bind(this);

    }



    handleTest = () => {
        alert("Game is clicked");
    }

    insertData = (actName) => {
        
        const {currentCount, currentUser, currentTime, endTime, timeRemaining, activityName, countActivity} = this.state;
        const newActivity = Firebase.database().ref().child('activities/' + actName + '/users/' + currentUser.uid);

        const userActs = Firebase.database().ref().child('users/' + currentUser.uid + '/activities/' + actName)

        const activityStartTime = firebase.database.ServerValue.TIMESTAMP
        const that = this;

        this.setState({loading: true})

        const activityData = {
            startTime: moment().toString(),
            endTime: endTime.toString(),
            remainingTime: endTime.diff(moment()),
        //    startTimes : activityStartTime,
        //    timeNow: new Date()
        }
       
        // insert activities
        const actsData = []
        newActivity.set(activityData).then(data => {
            actsData.push(data)
            that.setState({loading: false, timeRemaining: timeRemaining - 10000, activities: actsData,
                            startTime: activityData.startTime, countActivity: countActivity + 1})
            }).catch(error => {
            alert("Error happened: ", error)
        })
    



        if(endTime.diff(moment()) < 0) { 
        newActivity.remove();
        userActs.remove()
        clearInterval(this.intervalId);
        alert("Time for " + actName + " is Over");
        
        }
        
        
    }

    displayTimeDelay = (currentUser) => {
        const that = this
        // const activity = Firebase.database().ref().child('activities/bar/users/' + currentUser.uid);

        // activity.on('value', (dataSnapshot) => {
        //     let data = dataSnapshot.val()
        //     let activityStartTime = data.startTimes
        //     let timeAgo = <TimeAgo time={activityStartTime} />
        //     let activityTime = formatTime(activityStartTime)

        //     if(activityTime === "1h"){ 
        //         alert("Works: "+ activityTime)
        //         that.setState({startTime: activityTime + " Works"})
        //     }
            
        //     that.setState({startTime: activityTime})
        
        // })
        
    }


    handleActivityClick(actName){

        // const {currentUser, currentTime, endTime} = this.state;
        // const {currentUser} = this.state.currentUser.uid;
        // const {startTime} = this.state.currentTime;
        // const {endTime} = 'this.state.endTime';
        // const {endTime} = this.state;
        // if(endTime.diff(moment()) < 0){
        //     clearInterval(this.intervalId);
        // }
        const {currentUser, endTime} = this.state;

        const userData = Firebase.database().ref().child('users/' + currentUser.uid)
        const userActs = userData.child('activities')

        // userData.once('value', datasnapshot => {
        //     const data = datasnapshot.val();
        //     alert("User Data is: " + data.nombre)
        // })

        const  userActivity = userActs.child(actName)

        // const userNewAct = userActivity.push()

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


            // alert("Total activities are: " + countTotal)
            
            if(countTotal < 2){
                that.setState({countActivity: countTotal})
                userActivity.set(activityName)
                this.intervalId = setInterval(() => {
                    that.insertData(actName)
                }, 2000);

                that.props.navigation.navigate('People', {activityName: actName})

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
                    that.props.navigation.navigate('People', {activityName: actName})
                }else{
                    alert("You cannot enter to more than two activities")
                }

                that.displayActivityLeftTime()
               
            }
        })
        // this.insertData(actName)
    }

    
    componentDidUpdate(){
        const {currentUser} = this.state.currentUser; 
        const {endTime} = moment().add(3600, 'seconds');    
        // this.insertData(currentUser.uid, 'Game');

    }

    displayActivityLeftTime = (userId, activityName) => {

    }



    componentDidMount(){
        // this.handleActivityClick();

        const {currentUser} = Firebase.auth();
        this.setState(
            {currentUser: currentUser,
             currentTime: moment()
            });
        this.countTotalUsers()
        // this.intervalId = setInterval(this.handleActivityClick, 10000);
        this.displayTimeDelay(currentUser) 
}

    countTotalUsers = () => {
        
        const activityNames = {
            game: 'game',
            drink: 'bar',
            theatre: 'movie_theater',
            play: 'gym',
            food: 'restaurant',
            coffee: 'cafe'
        }

        const totalGameUsers = Firebase.database().ref().child('activities/' + activityNames.game + '/users');
        const totalDrinkUsers = Firebase.database().ref().child('activities/' + activityNames.drink + '/users');
        const totalTheatreUsers = Firebase.database().ref().child('activities/' + activityNames.theatre + '/users');
        const totalPlayUsers = Firebase.database().ref().child('activities/' + activityNames.play + '/users');
        const totalFoodUsers = Firebase.database().ref().child('activities/' + activityNames.food + '/users');
        const totalCoffeeUsers = Firebase.database().ref().child('activities/' + activityNames.coffee + '/users');
        
        totalGameUsers.on('value', snapShot => {
            const countTotal = snapShot.numChildren()
            this.setState({
                gameCount: countTotal
            })
        
        })

        totalDrinkUsers.on('value', snapShot => {
            const countTotal = snapShot.numChildren()
            this.setState({
                drinkCount: countTotal
            })
        
        })

        totalTheatreUsers.on('value', snapShot => {
            const countTotal = snapShot.numChildren()
            this.setState({
                theatreCount: countTotal
            })
        
        })

        totalPlayUsers.on('value', snapShot => {
            const countTotal = snapShot.numChildren()
            this.setState({
                playCount: countTotal
            })
        
        })

        totalFoodUsers.on('value', snapShot => {
            const countTotal = snapShot.numChildren()
            this.setState({
                foodCount: countTotal
            })
        
        })

        totalCoffeeUsers.on('value', snapShot => {
            const countTotal = snapShot.numChildren()
            this.setState({
                coffeeCount: countTotal
            })
        
        })



    }
    
    render(){

        const  timestamp = this.state.startTime;
        
        const {currentCount, currentUser, activityName, loading} = this.state;



        return(
            <View style={styles.container}>

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
                        <Text style={{color: 'white', alignContent: 'center'}}>!Elige tu actividad favorita y encuentra 
                        gente que busca lo mismo!</Text>
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
        marginLeft: 20
    },
    displayActivities: {
        flex: 1,
        // backgroundColor: 'red',
        marginTop: 20
    },
    displayEachActivities: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 200,
        paddingTop: 20,
        borderRadius: 5
    }
});