import React, {Component} from "react";
import {Text, View, Alert,Dimensions,TextInput, Button,ImageBackground, Switch, Image, StatusBar, Platform, SafeAreaView, StyleSheet, KeyboardAvoidingView, TouchableOpacity} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import * as Font from "expo-font";

import Communications from "react-native-communications";
import firebase from "firebase";


let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
  };

export default class SaveIT extends Component{
  constructor(props) {
      super(props);
      this.state = {
        fontLoaded: false,
        isClean: false,
        isWash: false,
        isKitchen: false,
        isOthers: false,
        enabled: true,
        final: [],
        others: 'activity',
        activityData: [],
        activityUpdated: false,
        counter: 0,
        emailSent: false,
        parentEmail: "",
        emailText: "awesome",
        bank:0
      };
    }
  
  async loadFonts() {
    await Font.loadAsync(customFonts);
    this.setState({ fontLoaded: true });
  }

  componentDidMount = async()=> {
    this.loadFonts();
    this.loadData();
  }

  loadData = async()=>{
    await firebase
      .database()
      .ref("/Users/" + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
      this.setState({ 
        activityUpdated: snapshot.val().activityUpdated, 
        parentEmail: snapshot.val().parentEmail
      });
    });
    //this.reset();
  }


  openEmail = () => {
    var parentEmail = this.state.parentEmail;
    this.setState({emailSent:true});
    Communications.email(
      [parentEmail],
      null,
      null,
      'Please Approve!',
      "Dear Mom/Dad," +
        '\n\n' +
        'Hope you had a lovely day!' + 
        '\n\n' +
        'I had a/an ' +
        this.state.emailText +
        ' day! \n\n' +
        'Hugs, \n\n Your loving child'
    );
  };

  skip=()=>{
     this.setState({emailSent:true});
  }

  
  
  toggleSwitch(label) {
    if (label === 'clean') {
      this.setState({ isClean: !this.state.isClean });
    } else if (label === 'wash') {
      this.setState({ isWash: !this.state.isWash });
    } else if (label === 'kitchen') {
      this.setState({ isKitchen: !this.state.isKitchen });
    } else {
      this.setState({ isOthers: !this.state.isOthers });
    }
  }

  finalChoice = async() => {
    if (
      !this.state.isClean &&
      !this.state.isWash &&
      !this.state.isKitchen &&
      !this.state.isOthers
    ) {
      alert('Please select activity');
    } else {
      this.setState({ enabled: false });
      this.setState({ counter: 0 });
      var choice = [];
      var activity = [];
      choice.push({ act: 'Cleaned My Room', value: this.state.isClean });
      choice.push({ act: 'Laundry', value: this.state.isWash });
      choice.push({ act: 'Kitchen Chores', value: this.state.isKitchen });
      if (this.state.others === '') {
        choice.push({ act: 'others', value: this.state.isOthers });
        alert("Enter Others")
      } else {
        choice.push({ act: this.state.others, value: this.state.isOthers });
      }

      console.log(choice);

      choice.map((item) => {
        if (item.value === true) {
          activity.push(item.act);
        }
      });
      
      await firebase
      .database()
      .ref("/Users/" + firebase.auth().currentUser.uid).update({
        activity: activity,
        activityUpdated: true,
        noOfActivities: activity.length,
      });
    }
  };

  render(){
      const { fontLoaded } = this.state;

    if (fontLoaded) {
      if (this.state.activityUpdated === false) {
        return (
          <KeyboardAvoidingView style={styles.container}>
          <SafeAreaView style = {styles.droidSafeArea}/>
          <ImageBackground style = {{flex: 1, top: 160, width: 350}}
            resizeMode= 'contain'
            source = {require("../assets/nursery.png")}>
          <View style={styles.appIcon}>
            <Image
              source={require("../assets/pp.png")}
              style={styles.iconImage}
            ></Image>
          

          <Text style={styles.textNew}>What did you do today?</Text>
  
            <View style={{ flex: 0.2, flexDirection: 'row', top: -40 }}>
              <Text
                style={[styles.activityTextNew, {marginLeft: 100}]}>
                Cleaned My Room
              </Text>
              <Switch
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }], left: -50, top: 2,marginRight:10 }}
                trackColor={{
                  false: 'grey',
                  true: this.state.isClean ? 'cyan' : 'grey',
                }}
                thumbColor={this.state.isClean ? '#ee8249' : 'white'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => this.toggleSwitch('clean')}
                value={this.state.isClean}
              />

              <Text
                style={[styles.activityTextNew, {marginLeft: 30}]}>
                Laundry
              </Text>
              <Switch
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }], left: -50, top: 2,marginRight:10 }}
                trackColor={{
                  false: 'grey',
                  true: this.state.isWash ? 'cyan' : 'grey',
                }}
                thumbColor={this.state.isWash ? '#ee8249' : 'white'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => this.toggleSwitch('wash')}
                value={this.state.isWash}
              />
            </View>
  
            
  
            <View style={{ flex: 0.2, flexDirection: 'row', top: -50  }}>
              <Text
                style={[styles.activityTextNew, {marginLeft: 100}]}>
                Kitchen Chores
              </Text>
              <Switch
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }], left: -50, top: 2,marginRight:10 }}
                trackColor={{
                  false: 'grey',
                  true: this.state.isKitchen ? 'cyan' : 'grey',
                }}
                thumbColor={this.state.isKitchen ? '#ee8249' : 'white'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => this.toggleSwitch('kitchen')}
                value={this.state.isKitchen}
              />

              <Text
                style={[styles.activityTextNew, {marginLeft: 20}]}>
                Others
              </Text>
              <Switch
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }], left: -50, top: 2,marginRight: 10 }}
                trackColor={{
                  false: 'grey',
                  true: this.state.isOthers ? 'cyan' : 'grey',
                }}
                thumbColor={this.state.isOthers ? '#ee8249' : 'white'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => this.toggleSwitch('others')}
                value={this.state.isOthers}
              />

              

            </View>
            
            <TextInput
                style={{ backgroundColor: 'grey', borderRadius: 20, borderWidth:1, borderColor:"cyan", height: 30, top: -70, width: 150, left: 90, textAlign: "center" }}
                onChangeText={(text) => {
                  this.setState({ others: text });
                }}
                //value={this.state.others}
                placeholder="others"
              />

            <TouchableOpacity
              style={styles.button}
              disabled={this.state.activityUpdated}
              onPress={() => {
                if (this.state.isOthers && this.state.others === "activity") {
                  Alert.alert('Please enter Activity');
                  console.log(this.state.isOthers)
                } 
                else if(this.state.others === ""){
                  Alert.alert('Please enter Activity');
                }
                else
                 {
                  console.log("hi there")

                  this.finalChoice();
                }
              }}>
              <Text style={{fontSize:RFValue(18),color: "white",fontFamily: "Bubblegum-Sans", alignSelf:"center", justifyContent:"center"}}>Submit</Text>
              </TouchableOpacity>


            
              
          </View>
          
          
          </ImageBackground>
          </KeyboardAvoidingView>
        );
      } 
      else 
      if (this.state.emailSent === false) {
        return (
          <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea}/>
          <View style={styles.appIcon}>
            <Image
              source={require("../assets/pigeon.png")}
              style={[styles.iconImage],{width:150,height:165, top: 250, borderRadius: 30}}
            ></Image>
          
            
            
            
            
            <TextInput
              //value={this.state.emailText}
              onChangeText={(text) => 
              {
                if(text!==undefined){
                  this.setState({ emailText: text })
                }
                else{
                  this.setState({ emailText: "awesome" })}
                }
              }
              
              placeholder={'How was your day?'}
              style={styles.input}
            />
            
            <Text style ={{top: 70,fontFamily: "Bubblegum-Sans", color: "white", fontSize: 15, textAlign:"center"}}>{"Approval E-Mail/Reminder"}</Text>

            <View style={{ flex: 1, marginTop: 20, flexDirection: 'row' }}>
              <TouchableOpacity style={styles.emailButtons} onPress={this.openEmail}>
                <Text style ={{fontFamily: "Bubblegum-Sans", color: "white", fontSize: 15}}> Mail Parent </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.emailButtons} onPress={this.skip}>
                <Text style = {{fontFamily: "Bubblegum-Sans", color: "white", fontSize: 15}}> Cancel </Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>
        );
      }
      
      else {
        return (
          <View
          style={{ flex: 0.8, justifyContent: 'center', alignItems: "center" }}>
          <Text style ={{fontFamily: "Bubblegum-Sans", fontSize: 20}}> Waiting for Approval.... </Text>
        </View>
        );
      }
    }
    else{
      return null
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15192d",
    alignItems: "center",
  },
  containerLight: {
    flex: 1,
    backgroundColor: "#9E9FA3",
    alignItems: "center",
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  textNew:{
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    top: -60
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    top: -200,
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width:RFValue(100),
    height:RFValue(100),
    resizeMode: "contain",
    top: -100
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "#56BAC2",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(-320)
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
activityTextNew: {
  top: 30,
  fontSize:RFValue(15),
  color: "white",
  fontFamily: "Bubblegum-Sans",
  justifyContent:"center",
  alignItems:"center",
  left: -40,
  marginRight: 30
},
button: {
  top: -50,
  borderRadius: RFValue(20),
  borderWidth: RFValue(3),
  borderColor:"#ED7A7D",
  width: RFValue(200),
  alignItems: 'center',
  alignContent: "center",
  height:RFValue(40),
  backgroundColor: "grey",
  justifyContent: "center"
},
treeImage: {
  width:RFValue(250),
  height:RFValue(340),
  position: "absolute",
  marginLeft: RFValue(-125),
  //width: "10%",
  resizeMode: "contain",
  bottom: -280
},
input: {
  width: 255,
  height: 44,
  padding: 10,
  margin: 100,
  backgroundColor: '#FFF',
  borderColor: 'cyan',
  borderRadius: 30,
  borderWidth: 2,
  top: 150
},
emailButtons: {
  borderRadius: RFValue(20),
  borderWidth: RFValue(3),
  borderColor:"#ED7A7D",
  width: RFValue(100),
  alignItems: 'center',
  alignContent: "center",
  height:RFValue(40),
  backgroundColor: "grey",
  justifyContent: "center",
  marginLeft: 30,
  marginRight: 30,
  top: 70
},
});
