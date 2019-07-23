import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, TouchableHighlight}  from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Spinner} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Dialog, { DialogFooter, DialogButton, DialogContent, SlideAnimation, DialogTitle} from 'react-native-popup-dialog';

import moment from "moment";
import Firebase from '../../../utils/Config';

import {formatTime} from '../../../utils/getTimeAgo'
import firebase from 'firebase'

import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob';



export default class Activities extends Component{

    constructor(props){
        super(props);

        this.state = { currentCount: 3600, currentUser: null, currentTime: moment(), endTime: moment().add(180, 'seconds'), 
                       timeRemaining: 36000, activityName: '', loading: false, startTime: "a few seconds ago",
                       gameCount: 0, drinkCount: 0, playCount: 0, theatreCount: 0, coffeeCount: 0, foodCount: 0, 
                       countActivity: 0, activities: [], visible: false, minutesLeft: 0, isFullTime: false,
                       downloadUrl: null
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

    openPickerImage = () => {
        const {currentUser} = this.state
        
        
        this.setState({loading: true})
        const Blob = RNFetchBlob.polyfill.Blob
        const fs = RNFetchBlob.fs
    
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
        window.Blob = Blob;
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            mediaType: 'photo'
        }).then(image => {
            const ImagePath = image.path
            // console.log("Image Data are: ", image)
            let uploadBlob = null
            const imageRef = Firebase.storage().ref().child('activities/') 
            let mime = 'image/jpg'
            // alert(image)
            fs.readFile(ImagePath, 'base64')
                .then((data) => {
                    //  console.log(data)
                     return Blob.build(data, {type: `${mime};BASE64`})   
                })
                .then((blob) => {
                    uploadBlob = blob
                    return imageRef.put(blob, {contentType: mime})
                })
                .then(() => {
                    uploadBlob.close()
                    imageRef.getDownloadURL().then((url) => {
                        this.setState({
                            downloadUrl: url
                        })
                    })
                    return imageRef.getDownloadURL()
                })
                .then((url) => {
                    let userData = {}
                    let obj = {}
                    obj["loading"] = false
                    obj["dp"] = url
                    this.setState(obj)
                    this.saveChanges()
                    
                })
                .catch((error) => {
                    console.log(error)
                })
                
         })
    
    }


    saveChanges = () => {
            const {downloadUrl} = this.state
            const dbPath = Firebase.database().ref().child('activityPool/' + this.state.currentUser)
            let activityPoolPath = dbPath.push()
            
            const activityPoolData = {
                'image': downloadUrl,
                'type': 'movie',
                'description': 'Watch a movie',
                'active': true
            }

            activityPoolPath.set(activityPoolData)
        
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
                    // updated addition
                    else{
                        actExists = true
                        this.openPickerImage()
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
                                <Icon name="account-circle" style={{fontSize: 35, color: '#1f1f14'}} />
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.navigationItems} onPress={() => this.props.navigation.navigate('Activity')}>
                                <Icon name="mood" style={{fontSize: 40, color: '#4DDFE5'}}/>
                            </TouchableHighlight>
                            <View style={styles.navigationItems}>
                                <TouchableHighlight onPress={() => this.props.navigation.navigate('ChatContainer')}>
                                    <Icon name="message" style={{fontSize: 35, color: '#1f1f14'}}/>
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
                        <Text style={{alignContent: 'center',  fontSize: 16, marginTop: 5,
                                marginHorizontal: 30, marginVertical: 10}}>
                           Choose your favorite activity and find people who want the same!
                        </Text>

                        {
                          loading ? (
                              <View style={{justifyContent:'center', flexDirection: 'row'}}>
                                <Spinner color="red"/> 
                                 <View style={{marginLeft: 10, marginTop: 30}}>
                                     <Text style={{color: 'red', fontSize: 18, fontWeight: 'bold'}}>Connecting...</Text>  
                                 </View>
                              </View>
                            ):(
                            <Text style={{color: 'white'}}>''</Text>
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
                                            <Text style={isFullTime ? {fontSize:18, marginLeft: 5}: {fontSize: 18, color: 'red'}}>
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
                            <TouchableHighlight onPress={() => this.handleActivityClick('bar')}>
                                    <Card>
                                        <CardItem cardBody bordered>
                                            <Image source={require('../../../assets/images/ico_chela.jpg')} style={{height: 120, width: 150}}/>
                                        </CardItem>
                                        <CardItem bordered>
                                        <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                            <Icon name="account-circle" style={{fontSize: 24}}/>
                                            <Text style={isFullTime ? {fontSize:18, marginLeft: 5}: {fontSize: 18, color: 'red'}}>
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