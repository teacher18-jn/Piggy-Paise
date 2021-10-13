import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
//import { NavigationContainer } from "@react-navigation/native";
//import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Font from "expo-font";

import SaveIT from "../screens/SaveIT";
import BankIT from "../screens/BankIT";

//const Tab = createMaterialBottomTabNavigator();

let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
  };

const Tab = createBottomTabNavigator();
export default class BottomTabNavigator extends Component {
    constructor() {
        super();
        this.state = {
          fontLoaded: false,
          isUpdated: false
        };
      }
  
    async loadFonts() {
      await Font.loadAsync(customFonts);
      this.setState({ fontLoaded: true });
    }
    componentDidMount() {
      this.loadFonts();
    }

    renderFeed = props => {
      return <SaveIT setUpdateToFalse={this.removeUpdated} {...props} />;
    };
  
    renderStory = props => {
      return <BankIT setUpdateToTrue={this.changeUpdated} {...props} />;
    };
  
    changeUpdated = () => {
      this.setState({ isUpdated: true });
    };
  
    removeUpdated = () => {
      this.setState({ isUpdated: false });
    };
    
  render() {
    const { fontLoaded } = this.state;
      if(fontLoaded){
        return (
            <Tab.Navigator
              
              screenOptions={({ route }) => ({
                tabBarActiveTintColor: "#ee8249",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: styles.bottomTabStyle,
                tabBarLabelStyle: {
                  fontSize: RFValue(15),
                  fontFamily: "Bubblegum-Sans"
                },
                
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
    
                  if (route.name === "Save IT") {
                    iconName = focused
                      ? "cash"
                      : "cash-outline"
                  } else if (route.name === "Bank IT") {
                    iconName = focused
                      ? "wallet"
                      : "wallet-outline"
                  }
    
                  // You can return any component that you like here!
                  return (
                    <Ionicons
                      name={iconName}
                      size={size}
                      color={color}
                      style={styles.icons}
                    />
                  );
                }
              })}
              
            >
              <Tab.Screen name="Save IT" component={this.renderFeed} options ={{unmountOnBlur: true, headerShown : false}}/>
              <Tab.Screen name="Bank IT" component={this.renderStory} options ={{unmountOnBlur: true, headerShown : false}}/>
            </Tab.Navigator>
    
        );
      }
      else{
          return null
      }
    
  }
}

const styles = StyleSheet.create({
  bottomTabStyle: {
    backgroundColor: "#2d3f5f",
    height: "8%",
    borderTopLeftRadius: RFValue(30),
    borderTopRightRadius: RFValue(30),
    overflow: "hidden",
    position: "absolute"
  },
  bottomTabStyleLight: {
    backgroundColor: "#eaeaea",
    height: "8%",
    borderTopLeftRadius: RFValue(30),
    borderTopRightRadius: RFValue(30),
    overflow: "hidden",
    position: "absolute"
  },
  icons: {
    width: RFValue(25),
    height: RFValue(25)
  }
});
