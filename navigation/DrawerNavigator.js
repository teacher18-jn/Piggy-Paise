import "react-native-gesture-handler";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";;
import BottomTabNavigator from "./BottomTabNavigator";
import Profile from "../screens/Profile";
import ParentProfile from "../screens/ParentProfile";
import Logout from "../screens/Logout";
import Goals from "../screens/Goals";
import firebase from "firebase";
import CustomSidebarMenu from "../screens/CustomSidebarMenu"

const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends React.Component{
  render(){
    return (
      <Drawer.Navigator
        contentOptions = {{
          activeTintColor :'#ffffff',
           

          activeBackgroundColor :'#1999CE',
          inactiveBackgroundColor :'#ffffff',
          itemStyle: {marginVertical: 7},
          iconContainerStyle:{
            opacity:1
          }
        }}
        drawerContent = {(props) => <CustomSidebarMenu {...props}/>}
      >
          <Drawer.Screen 
            name = "Home" 
            component ={BottomTabNavigator}
            options={{ unmountOnBlur: true }}
            />
          <Drawer.Screen 
            name = "Goals" 
            component = {Goals}
            options={{ unmountOnBlur: true }}
            />
          <Drawer.Screen 
            name = "Profile" 
            component = {Profile} 
            options={{ unmountOnBlur: true }}/>
          <Drawer.Screen 
            name = "Parent Profile" 
            component = {ParentProfile} 
            options={{ unmountOnBlur: true }}/>
          <Drawer.Screen 
            name = "Logout" 
            component = {Logout} 
            options={{ unmountOnBlur: true }}/>
        </Drawer.Navigator>
    )
  }
}

