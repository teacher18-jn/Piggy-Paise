import React, {Component} from "react";
import {Text, TextInput, View, Alert, Dimensions,TouchableOpacity, Image, StatusBar, Platform, SafeAreaView, StyleSheet, KeyboardAvoidingView} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import firebase from "firebase";

let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
  };

export default class Goals extends Component{
  constructor(props) {
      super(props);
      this.state = {
        fontLoaded: false,
        goal: '',
        goalAmount: null,
        goalAmountFromDB: null,
        total: null,
        balance: 0,
        newGoalFLag: false,
      };
  }

  componentDidMount() {
    this.loadFonts();
    this.loadData()
  }
  
  async loadFonts() {
    await Font.loadAsync(customFonts);
    this.setState({ fontLoaded: true });
  }

  loadData = async() => {
    await firebase
      .database()
      .ref("/Users/" + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
      var goalAmountFromDB = snapshot.val().GoalAmount;
      var goalFromDB = snapshot.val().Goal;
      var totalFromDB = snapshot.val().Total;

      var balance = 0;
      balance = goalAmountFromDB - totalFromDB;
      console.log("Balance" + balance)
      this.setState({ 
        goalAmount: goalAmountFromDB, 
        goalAmountFromDB: goalAmountFromDB,
        goal: goalFromDB,
        total: totalFromDB,
        balance: balance});

      if (totalFromDB >= goalAmountFromDB && goalAmountFromDB != 0) {
        this.setState({ newGoalFLag: true });
      }
    });
  }

  showAlert() {
    Alert.alert('New Goal', 'Are you sure you want to set new Goal?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => this.setNewGoal() },
    ]);
  }
  
  setNewGoal = async() => {
    var diffAmount = 0;
    if (this.state.total > this.state.goalAmount) {
      diffAmount = this.state.total - this.state.goalAmount;
    }

    await firebase
        .database()
        .ref("/Users/" + firebase.auth().currentUser.uid)
        .update({
      Total: diffAmount,
      Goal: '',
      GoalAmount: 0,
    });

    this.setState({ 
      goalAmountFromDB: 0, 
      newGoalFLag: false 
    });
  }

  addGoal = async()=> {

    var goalAmount = parseInt(this.state.goalAmount);
    var goal = this.state.goal;
    var total = this.state.total;

    await firebase
        .database()
        .ref("/Users/" + firebase.auth().currentUser.uid)
        .update({
      Goal: goal,
      GoalAmount: goalAmount,
      Total: total,
    });
    
  }

  render(){
    const newGoalFLag = this.state.newGoalFLag;
    const { fontLoaded } = this.state;

    if (fontLoaded) {
      if (this.state.goalAmountFromDB === 0) {
        return (
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            <SafeAreaView style={styles.droidSafeArea} />
              <View style = {styles.appIconNew}>
                <Image
                  source={require("../assets/pp.png")}
                  style={styles.iconImageNew}
                />
              
                <Text style={styles.textNew}>My Goals</Text>
              
                <Text style={styles.activityTextNew}>Enter your Goal</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => {
                      this.setState({ goal: text });
                    }}
                    value={this.state.goal}
                    placeholder="Enter Your Goal"
                />
                  
                <Image
                  source={require("../assets/goals.png")}
                  style={styles.goalImageNew}
                />
                  
                  
                <Text style={styles.activityTextNew}>Enter Amount</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => {
                      this.setState({ goalAmount: text });
                    }}
                        //value={this.state.goalAmount}
                    placeholder="Enter Amount"
                />
                      
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.addGoal()}>
                  <Text style={{fontSize:RFValue(20),color: "white",fontFamily: "Bubblegum-Sans", alignSelf:"center", justifyContent:"center"}}>Add</Text>
                </TouchableOpacity>

              </View>
          </KeyboardAvoidingView>
        );
      } 

      else {
        var balance = this.state.balance
        return (
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            <SafeAreaView style={styles.droidSafeArea} />
            
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/pp.png")}
                style={styles.iconImage}
              ></Image>
            
              <Text style={styles.text}>My Goals</Text>

              <View style={styles.goalContainer}>
                  <Text style={styles.activityText}> Goal : {this.state.goal} </Text>
                  <Image
                  source={require("../assets/goals.png")}
                  style={styles.goalImage}
                />
                  <Text style={styles.activityText}> Goal Amount : ₹ {this.state.goalAmount} </Text>
              </View>
                
              <View style={styles.bankContainer}>
                <Text style={[styles.activityText,{color: "#191919", alignSelf:"center",top:25}]}> Piggy Paise : ₹ {this.state.total}</Text>
                {
                  (this.state.balance < 0) 
                  ? <Text style={[styles.activityText,{color: "white", alignSelf:"center", fontSize:15}]}> You have saved ₹ {-(balance)} more</Text>
                  : (this.state.balance === 0)
                    ? <Text style={[styles.activityText,{color: "white", alignSelf:"center", fontSize:15}]}> Bravo! Set your New Goal!</Text>
                    : <Text style={[styles.activityText,{color: "white", alignSelf:"center", fontSize:15}]}> More To Go : ₹ {this.state.balance}</Text>
                }
                
                <View style={{flex: 0.2}}>
                  <Image
                  source={require("../assets/bank.png")}
                  style={styles.bankImage}
                  />
                </View>
              </View>


              {newGoalFLag ? (
                    
                <TouchableOpacity
                  style={styles.buttonNewGoal}
                  onPress={() => this.showAlert()}>
                  <Text style={styles.newGoalText}> Set New Goal </Text>
                </TouchableOpacity>
                    
              ) : (
                <Text> </Text>
              )}
              
            </View>
          </KeyboardAvoidingView>
        );
      }
    }
    else{
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15192d",
    alignItems: "center",
    justifyContent: "center"
  },
  containerLight: {
    flex: 1,
    backgroundColor: "#9E9FA3",
    alignItems: "center",
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.1,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.9,
    justifyContent: "flex-start",
    alignItems: "center",
    top: -60,
  },
  appIconNew: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    top: -170,
  },
  iconImage: {
    width:RFValue(150),
    height:RFValue(150),
    resizeMode: "contain",
  },
  iconImageNew: {
    width:RFValue(150),
    height:RFValue(150),
    justifyContent: "center",
    alignItems:"center"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "#56BAC2",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans",
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  cardContainer: {
    flex: 0.85
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
},
goalContainer: {
  top: 50,
  flex: 0.4,
  borderRadius: RFValue(30),
  alignItems: "center", 
  justifyContent: "center",
  backgroundColor: "#191919", 
  zIndex:-1, 
  width: RFValue(300), 
  height: RFValue(200),
  borderWidth: RFValue(2),
  borderColor: "#56BAC2"
},

goalContainerNew: {
  flex: 0.5,
  flexDirection: "row",
  borderRadius: RFValue(30),
  alignItems: "center", 
  justifyContent: "center",
  backgroundColor: "#191919", 
  zIndex:-1, 
  width: RFValue(300), 
  height: RFValue(500),
  borderWidth: RFValue(2),
  borderColor: "#56BAC2",
},
goalImage: {
  width:RFValue(60),
  height:RFValue(75),
  left: 10,
  position: "absolute",
  resizeMode: "contain",
},
goalImageNew: {
  width:RFValue(40),
  height:RFValue(75),
  top: 60,
  resizeMode: "contain",
},
textInput:{
  fontFamily: "Bubblegum-Sans",
  backgroundColor: "#8CCEB8", 
  borderRadius: RFValue(10), 
  width: RFValue(200),
  top:60, 
  justifyContent:"center", 
  textAlign:"center"
},
text:{
  top: 20,
  color: "white",
  fontFamily: "Bubblegum-Sans",
  fontSize: RFValue(25),
},
textNew:{
  top: 20,
  color: "white",
  fontFamily: "Bubblegum-Sans",
  fontSize: RFValue(25),
  textDecorationLine: "underline"
},
activityText: {
  fontSize:RFValue(15),
  color: "white",
  fontFamily: "Bubblegum-Sans",
  marginBottom: 30,
  justifyContent:"center",
  alignItems:"center"
},
activityTextNew: {
  top: 60,
  fontSize:RFValue(15),
  color: "white",
  fontFamily: "Bubblegum-Sans",
  justifyContent:"center",
  alignItems:"center"
},
button: {
  top: RFValue(100),
  borderRadius: RFValue(20),
  borderWidth: RFValue(4),
  borderColor:"#ED7A7D",
  width: RFValue(150),
  alignItems: 'center',
  alignContent: "center",
  height:RFValue(40),
  backgroundColor: "grey",
  justifyContent: "center"
},
buttonNew: {
  borderRadius: RFValue(20),
  borderWidth: RFValue(4),
  borderColor:"#ED7A7D",
  width: RFValue(150),
  alignItems: 'center',
  alignContent: "center",
  backgroundColor: "grey",
  justifyContent: "center"
},
buttonNewGoal: {
  borderRadius: RFValue(20),
  borderWidth: RFValue(2),
  borderColor: "white",
  width: RFValue(150),
  height: RFValue(40),
  alignItems: 'center',
  justifyContent: "center",
  backgroundColor: "#ED7A7D",
  top: 130,
},
newGoalText:{
  color:"#191919",
  fontFamily: "Bubblegum-Sans",
  fontSize: RFValue(15)
},
bankContainer: {
  //flexDirection: "row",
  borderRadius: RFValue(30),
  alignItems: "center", 
  justifyContent: "center",
  backgroundColor: "#8CCEB8", 
  zIndex:-1, 
  width: RFValue(300), 
  height: RFValue(70),
  borderWidth: RFValue(2),
  borderColor: "white",
  top: 110
},
bankImage: {
  width:RFValue(50),
  height:RFValue(50),
  position: "absolute",
  left: RFValue(80),
  resizeMode: "contain",
  bottom: RFValue(71)
},
});
