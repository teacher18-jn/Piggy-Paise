import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Image,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class BankITScreen1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      activitiesList: [],
      approveFlag: false,
      code: '',
      cleanflag: false,
      washFlag: false,
      kitchenFlag: false,
      otherFlag: false,
      otherActivity: '',
      isClean: false,
      isWash: false,
      isKitchen: false,
      isOthers: false,
      noOfActivities: 0,
      others: '',
      amountFromDB: 0,
      approveEnabled: true,
      activitiesListDB: [],
      activityUpdated: false,
      secretCodeFlag: true,
      bank:0
    };
  }

  async loadFonts() {
    await Font.loadAsync(customFonts);
    this.setState({ fontLoaded: true });
   }

  componentDidMount() {
    this.createList();
    this.loadFonts();
  }

  createList = async() => {
    var activitiesListDB;
    var info = null;
    await firebase
      .database()
      .ref("/Users/" + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        info = snapshot.val();
    });

    this.setState({
      bank: info.bank
    })

    if(info.secretCode === 0){
      this.setState({ 
        secretCodeFlag: false
      });
    }
    else{
      this.setState({
        activityUpdated: info.activityUpdated,
        noOfActivities: info.noOfActivities,
        activitiesListDB: info.activity
       }); 
    }
 

    activitiesListDB = this.state.activitiesListDB;

    var activitiesList = [];
    for (var i in activitiesListDB) {
      activitiesList.push(activitiesListDB[i]);
      if (activitiesListDB[i] === 'Cleaned My Room') {
        this.setState({ cleanFlag: true });
      } else if (activitiesListDB[i] === 'Laundry') {
        this.setState({ washFlag: true });
      } else if (activitiesListDB[i] === 'Kitchen Chores') {
        this.setState({ kitchenFlag: true });
      } else {
        this.setState({ otherFlag: true });
        this.setState({ otherActivity: activitiesListDB[i] });
      }
    }
    this.setState({ activitiesList: activitiesList });

    this.setState({ 
      amountFromDB: info.Total, 
      approveEnabled: true 
    });
  };


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
    this.setState({approveFlag: false})
  }

tempCheckActivities = () => {
    var tempChoice = [];
    tempChoice.push({ chore: 'Cleaned My Room', value: this.state.isClean });
    tempChoice.push({ chore: 'Laundry', value: this.state.isWash });
    tempChoice.push({ chore: 'Kitchen Chores', value: this.state.isKitchen });
    tempChoice.push({ chore: this.state.others, value: this.state.isOthers });
    console.log('tempchoice:' + tempChoice);
    
    var count = 0;
    tempChoice.map((item, index) => {
      if (item.value === true) {
        count += 1;
      }
    })

    if(count === 0){
      alert("Select activity to Approve");
    }
    else{
      this.setState({
        noOfActivities: count,
        approveFlag: true
      })
    }
    
  };

  tempSubmit = async() => {
    if (!this.state.code.trim()) {
      alert('Please Enter Code');
      return;
    }
    var secretCode = 0;
    await firebase
    .database()
    .ref("/Users/" + firebase.auth().currentUser.uid)
    .on('value', (snapshot) => {
        secretCode = snapshot.val().secretCode;
      });
    if (parseInt(this.state.code) === secretCode) {
      var temp = 0;
      var amount = this.state.noOfActivities * 10 + this.state.amountFromDB;

      var bank = this.state.bank;
      bank = bank + this.state.noOfActivities * 10;

      await firebase
        .database()
        .ref("/Users/" + firebase.auth().currentUser.uid)
        .update({
          Total: amount,
          bank: bank
        });

      this.reset();

    } else {
      alert('Code Incorrect');
      this.setState({
        code: ""
      })
    }
  }

  reset = async() =>{
    this.setState({ approveFlag: false });
    this.setState({ noOfActivities: 0 });
    this.setState({ activitiesList: [] });
      this.setState({ cleanFlag: false });
      this.setState({ washFlag: false });
      this.setState({ kitchenFlag: false });
      this.setState({ otherFlag: false });
      this.setState({ activityUpdated: false });
      
      await firebase
      .database()
      .ref("/Users/" + firebase.auth().currentUser.uid)
      .update({
        activity: '',
        activityUpdated: false,
        noOfActivities: 0,
      });
      this.setState({ noOfActivities: 0 });
  }

  render() {
    const { fontLoaded } = this.state;
    const cleanFlag = this.state.cleanFlag;
    const washFlag = this.state.washFlag;
    const kitchenFlag = this.state.kitchenFlag;
    const otherFlag = this.state.otherFlag;
    const approveFlag = this.state.approveFlag;
    const secretCodeFlag = this.state.secretCodeFlag;

    if (fontLoaded) {
    if(secretCodeFlag === false){
      return(
        <View
          style={{ flex: 1, backgroundColor: "#15192d",justifyContent: "center", alignItems: "center"}}>
          <Text style ={{top: -90,fontFamily: "Bubblegum-Sans",fontSize: 20, color: "white", alignItems: "center", justifyContent:"center", alignContent:"center"}}> {"Set Secret Code in Parent Profile screen \n to approve Activities"}</Text>
        </View>
      )
    }
    else if (this.state.activityUpdated) {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          
          <View style={{justifyContent: "center",alignItems:"center",top:90}}>
              <Image
                source={require("../assets/pp.png")}
                style={styles.iconImage}
              ></Image>

              <Text style={styles.textNew}> Your Kiddie's Chores</Text>
            </View>
            <View style={{elevation: -1}}>
          <Image style = {{width: 180,height:180,right:-200,top:140}}
            resizeMode= 'contain'
            blurRadius={0.5}
            source = {require("../assets/tree.png")}/>
            </View>
                
          {cleanFlag ? (
            <View style={{ top: -30,left: 40,flexDirection: 'row', marginTop: 10 }}>
            <Switch
              style={{ transform: [{ scaleX: 1}, { scaleY: 1}], marginLeft: 5, marginRight: 5 }}
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
              style={styles.appTitleText}>
              Cleaned My Room
            </Text>
            
          </View>
          ) : undefined}

          {washFlag ? (
            <View style={{ top: -30,left: 40,flexDirection: 'row', marginTop: 10  }}>
            <Switch
              style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }], marginLeft: 5 , marginRight: 5}}
              trackColor={{
                false: 'grey',
                true: this.state.isWash ? 'cyan' : 'grey',
              }}
              thumbColor={this.state.isWash ? '#ee8249' : 'white'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => this.toggleSwitch('wash')}
              value={this.state.isWash}
            />
            <Text
              style={styles.appTitleText}>
              Laundry
            </Text>
            
          </View>
          ) : undefined}

          {kitchenFlag ? (
            <View style={{ top: -30,left: 40,flexDirection: 'row' , marginTop: 10 }}>
            <Switch
              style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] , marginLeft: 5, marginRight: 5}}
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
              style={styles.appTitleText}>
              Kitchen Chores
            </Text>
            
          </View>
          ) : undefined}

          {otherFlag ? (
            <View style={{ top: -30,left: 40,flexDirection: 'row', marginTop: 10  }}>
            <Switch
              style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }], marginLeft: 5, marginRight: 5 }}
              trackColor={{
                false: 'grey',
                true: this.state.isOthers ? 'cyan' : 'grey',
              }}
              thumbColor={this.state.isOthers ? '#ee8249' : 'white'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => this.toggleSwitch('others')}
              value={this.state.isOthers}
            />
            <Text
              style={styles.appTitleText}>{this.state.otherActivity}
            </Text>
            
            
          </View>
          ) : undefined}

          <View style={{ top: 60,flexDirection: 'row', zIndex: 2}}>
          <TouchableOpacity
            style={styles.buttonNotApprove}
            disabled={this.state.approveFlag}
            onPress={() => {
              this.reset();
            }}>
            <Text style={{ fontSize: RFValue(15),color: "white",fontFamily: "Bubblegum-Sans",alignItems: "center", top:15 }}> Don't Approve </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonApprove}
            disabled={!this.state.approveEnabled}
            onPress={() => {
              this.tempCheckActivities();
              //this.approve();
            }}>
            <Text style={{ fontSize: RFValue(15),color: "white",fontFamily: "Bubblegum-Sans",alignItems:"center", top:15}}> Approve </Text>
          </TouchableOpacity>

          
          </View>

          {approveFlag ? (
            <View style={{ left: 50,alignItems: 'center'}}>
              
              <TextInput
                style={{ backgroundColor: 'white', borderRadius: 20, borderWidth:3, borderColor:"grey", left: -30,height: 40, width: 200, top: 80, textAlign: "center" }}
                secureTextEntry={true}
                keyboardType={"numeric"}
                maxLength = {4}
                placeholder="Secret Code"
                value={this.state.code}
                onChangeText={(text) => {
                  this.setState({ code: text });
                }}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => this.tempSubmit()}>
                <Text style = {{fontSize: RFValue(15),fontFamily: "Bubblegum-Sans",color:"white"}}> Submit </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text> </Text>
          )}
          
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 0.8, justifyContent: 'center', alignItems: "center" }}>
          <Text style ={{fontFamily: "Bubblegum-Sans",fontSize: 20}}> No Activities to Approve.... </Text>
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
    backgroundColor: '#15192d',
  },
  text: {
    color: 'black',
    textAlign: 'center',
  },
 
  list: {
    alignItems: 'center',
    marginTop: 10,
  },
  buttonApprove: {
    borderRadius: 20,
    borderWidth: 3,
    width: 120,
    height: 50,
    alignItems: 'center',
    left: 100,
    marginBottom: 10,
    marginRight: 10,
    borderColor: "grey",
    backgroundColor: "#1A3E26"
  },
  buttonNotApprove: {
    borderRadius: 20,
    borderWidth: 3,
    width: 120,
    height: 50,
    alignItems: 'center',
    left: 80,
    marginBottom: 10,
    marginRight: 10,
    borderColor: "#1A3E26",
    backgroundColor: "grey"
  },
  submitButton: {
    borderRadius: 20,
    borderWidth: 2,
    width: 100,
    height: 30,
    alignItems: 'center',
    left: -30,
    top: 80,
    marginTop: 30,
    marginLeft: 10,
    borderColor: "white",
    backgroundColor: "#1A3E26",
  },
  inputBox: {
    marginTop: 5,
    width: '80%',
    alignSelf: 'center',
    height: 40,
    textAlign: 'center',
    borderWidth: 2,
    backgroundColor: 'white',
  },
  toggleView: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 100,
  },
  
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appIcon: {
    justifyContent: "flex-start",
    alignItems: "center"
  },
  iconImage: {
    marginTop: RFValue(-100),
    left: 10,
    width:RFValue(100),
    height:RFValue(100),
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(15),
    fontFamily: "Bubblegum-Sans",
    
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  textNew:{
    marginTop: 10,
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    
  },
});
