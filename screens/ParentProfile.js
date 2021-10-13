import React, {Component} from "react";
import {Text, View, StatusBar, Image,Platform, SafeAreaView, StyleSheet, TextInput,TouchableOpacity, KeyboardAvoidingView} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
  };

export default class ParentProfile extends Component{
    constructor(props) {
        super(props);
        this.state = {
          fontLoaded: false,
          email: "",
          secretCode: "",
          confirmSecretCode: 0,
          emailFlag: false,
          secretCodeFlag: false,
          enabledFlag: true,
          dbFlag: true,
          bank: 0
        };
      }
    
    async loadFonts() {
        await Font.loadAsync(customFonts);
        this.setState({ fontLoaded: true });
    }
    
    componentDidMount() {
        this.loadFonts();
        this.getData();
    }

    getData = async() => {
      await firebase
        .database()
        .ref("/Users/" + firebase.auth().currentUser.uid)
        .once('value', (snapshot) =>{
          this.setState({bank: snapshot.val().bank})
          if (snapshot.val().parentEmail != '') {
            this.setState({ emailFlag: true, email: snapshot.val().parentEmail });
          }
          if (snapshot.val().secretCode != 0) {
            this.setState({ secretCodeFlag: true, secretCode: snapshot.val().secretCode });
          }
          if (this.state.emailFlag === true && this.state.secretCodeFlag === true) {
            this.setState({ enabledFlag: true,dbFlag:true});
          }
          else{
            this.setState({dbFlag:false});
          }
        });
    }

    submit = async () => {
        if (this.state.email === '') {
          alert('Please enter Email address');
        } else if (!this.validateEmail(this.state.email)) {
          alert('Invalid Email address');
        } else if (
          this.state.secretCode === '' ||
          this.state.confirmSecretCode === ''
        ) {
          alert('Please enter Secret Code');
        } else if (
          !this.validateSecretCode(this.state.secretCode) ||
          !this.validateSecretCode(this.state.confirmSecretCode)
        ) {
          alert('Secret code should be a 4 digit number');
        }else if(this.state.secretCode === "0000") {
          alert('Secret code cannot be zero');
          this.setState({
            secretCode: "",
            confirmSecretCode: ""
          })
        }
        else {
          if (
            this.state.secretCode.length === 4 &&
            this.state.confirmSecretCode.length === 4
          ) {
            if (this.state.secretCode === this.state.confirmSecretCode) {
              var secretCode = parseInt(this.state.secretCode);
              await firebase
              .database()
              .ref("/Users/" + firebase.auth().currentUser.uid)
              .update({
                parentEmail: this.state.email,
                secretCode: secretCode,
              });
              this.setState({ enabledFlag: true , dbFlag : true});
            } else {
              alert('Please confirm the secret code again');
            }
          } else {
            alert('Code should be of 4 digits');
          }
        }
    };

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[  [0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      };
    
    validateSecretCode = (secretCode) => {
        var re = /^[0-9\b]+$/;
        return re.test(secretCode);
    };
    
    reset = async () => {
      await firebase
        .database()
        .ref("/Users/" + firebase.auth().currentUser.uid)
        .update({
        parentEmail: '',
        secretCode: 0,
      });
      this.setState({ enabledFlag: false});
    };

    paid = async()=>{
      await firebase
        .database()
        .ref("/Users/" + firebase.auth().currentUser.uid)
        .update({
        bank: 0,
      });
      this.setState({ bank: 0});
    }

    render(){
        const { fontLoaded } = this.state;
    if (!fontLoaded) {
      return(
        <View style={styles.container}>
            <Text style = {{color: "white"}}> Loading.... </Text>
        </View>
      )
    }
    else 
    {if (this.state.enabledFlag === false) {
            return (
              <KeyboardAvoidingView style={styles.container}>
              <SafeAreaView style={styles.droidSafeArea} />
              <View style = {styles.appIcon}>
                <Image
                  source={require("../assets/parent.png")}
                  style={styles.iconImageNew}
                />
              
                <Text style ={styles.text}> Parent's Profile </Text>
      
                <View style={{ flexDirection: 'row', marginTop: 60 }}>
                  <Text style ={styles.activityText}> Parent Email: </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="abc@example.com"
                    onChangeText={(text) => this.setState({ email: text })}
                    keyboardType={'email-address'}
                  />
                </View>
      
                <View style={{ flexDirection: 'row', marginTop: 40, alignItems: "flex-start" }}>
                  <Text style={styles.activityText}> Enter Secret code: </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Secret Code"
                    onChangeText={(text) => this.setState({ secretCode: text })}
                    secureTextEntry={true}
                    keyboardType={"numeric"}
                    maxLength = {4}
                  />
                </View>
      
                <View style={{ flexDirection: 'row', marginTop: 40 }}>
                  <Text style={styles.activityText}> Confirm Secret code: </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Confirm Secret Code"
                    onChangeText={(text) =>
                      this.setState({ confirmSecretCode: text })
                    }
                    secureTextEntry={true}
                    keyboardType={"numeric"}
                    maxLength = {4}
                  />
                </View>
      
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.submit()}>
                  <Text style={{fontSize:RFValue(20),color: "white",fontFamily: "Bubblegum-Sans", alignSelf:"center", justifyContent:"center"}}>Submit</Text>
                </TouchableOpacity>

                
                </View>
              </KeyboardAvoidingView>
            );
          } else {
            return (
              <KeyboardAvoidingView style={styles.container}>
              <SafeAreaView style={styles.droidSafeArea} />
              <View style = {styles.appIcon}>
              <Image
                  source={require("../assets/parent.png")}
                  style={styles.iconImageNew}
                />

              <Text style ={styles.text}> Parent's Profile </Text>
                <Text style = {[styles.activityText,{top: 60}]}>Email : {this.state.email}</Text>
      
                <Text style={[styles.activityText,{top: 60}]}>Secret Code : {this.state.secretCode}</Text>

      
                <TouchableOpacity style={styles.button} onPress={() => this.reset()}>
                <Text style={{fontSize:RFValue(15),color: "white",fontFamily: "Bubblegum-Sans", alignSelf:"center", justifyContent:"center"}}>RESET</Text>
                </TouchableOpacity>

                </View>
                
                <View style={{flex: 0.2}}>
                  <Image
                  source={require("../assets/bank.png")}
                  style={styles.bankImage}
                  />
                </View>
                <View style = {{justifyContent:"center", alignItems:"center", backgroundColor: "white", top: -120,left: 80,width: 250, height: 45, borderRadius: 20, borderWidth: 2, borderColor: "cyan"}}>
                  <Text style={[styles.activityText,{color: "black", fontSize: 18, top: 5}]}>Piggy Bank: ₹ {this.state.bank}</Text>
                </View>
                <TouchableOpacity style={[styles.button,{height: 50, top: -100,left:110, width: 200}]} onPress={() => this.paid()}>
                  <Text style={{fontSize:RFValue(15),color: "white",fontFamily: "Bubblegum-Sans", alignItems:"center", justifyContent:"center"}}>{"Allowance Paid"}</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            );
          }
    }
    }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15192d"
  },
  containerLight: {
    flex: 1,
    backgroundColor: "white"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    top: -120,
  },
  iconImageNew: {
    top:5,
    width:RFValue(140),
    height:RFValue(140),
    justifyContent: "center",
    alignItems:"center"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
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
  text:{
    top: 20,
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
  },
  activityText: {
    fontSize:RFValue(15),
    color: "white",
    fontFamily: "Bubblegum-Sans",
    justifyContent:"center",
    alignItems:"center",
    top: 3,
    right: 5
  },
  button: {
    top: RFValue(80),
    borderRadius: RFValue(20),
    borderWidth: RFValue(4),
    borderColor:"#ED7A7D",
    width: RFValue(100),
    alignItems: 'center',
    alignContent: "center",
    height:RFValue(40),
    backgroundColor: "grey",
    justifyContent: "center"
  },
  textInput:{
    backgroundColor: 'grey',
    borderWidth: 1,
    borderColor: "cyan",
    height: 30,
    width: 200,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20
  },
  bankImage: {
    width:RFValue(50),
    height:RFValue(50),
    position: "absolute",
    left: RFValue(80),
    resizeMode: "contain",
    bottom: RFValue(95)
  },
});
