import React, { useState, useEffect, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput as TextBox,
  Button,
  ScrollView,
  TouchableHighlight,
  Image,
  Alert,
} from "react-native";
import WelcomeUserBanner from "./WelcomeUserBanner";
import Firebase from "./Firebase";
import goBackImg from "../../assets/go-back.png";
import * as Haptics from "expo-haptics";
import appStyles from "./AppStyles";
import {AsyncStorage, NativeModules, Picker} from 'react-native';
import * as firebase from 'firebase';
import TextInput from "./TextInput.jsx";
//import {Picker} from '@react-native-community/picker';


class SettingScreen extends React.Component {

  _isMounted = false;

  constructor(props){
    super(props);
    this.state = { 
      phoneNumber: null,  
      dob: null, 
      pregnant: null, 
      infant: null, 
      babyGender:{
        male: null,
        female: null
      }, 
      liveMiami: null,
      fullName: null,
      };

    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    

  }
  



  onChangeText = (object) => {
    this.setState(object);
  };

   goBack = () => {
    Haptics.selectionAsync().then();
    this.props.goBack();
  };

    AsyncAlert = () => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out of this account?",
        [
          { text: "YES", onPress: () => resolve(true) },
          { text: "NO", onPress: () => resolve(false) },
        ],
        { cancelable: false }
      );
    });
  };


fetchUserInfo = () => {
  let fb = new Firebase();
  let uid = firebase.auth().currentUser.uid;
  this._isMounted = true;
  
  if (uid !== null) {
    console.log("User id >>>>>>>>>: " + uid);
    fb.getUserInfo(uid).on('value', (snapshot) => {
      if (this._isMounted){

        this.setState({fullName: snapshot.val().fullName,
          babyGender:{
            male: snapshot.val().babyGender.male,
            female: snapshot.val().babyGender.female,
          }, 
          phoneNumber: snapshot.val().phoneNumber,
          pregnant: snapshot.val().pregnant,
          infant: snapshot.val().infant,
          dob: snapshot.val().dob,
          liveMiami: snapshot.val().liveMiami,
          screen: 'setting'});
        
      }
     
    });

  }else {
    alert("Error: Couldn't get the user Information");
  }
 

};



 

onSubmit = (fullName, dob, phoneNumber, infant, pregnant, liveMiami, babyGender) => {
  Haptics.selectionAsync().then();
  let uid = firebase.auth().currentUser.uid;
  let male = babyGender.male;
  let female = babyGender.female;

    if (male === true) {
      female = false;

    }else if (female === false) {
      female = true;
      
    } else {
      male = false;
    }
  

  if (uid !== null) {

    if (!this.state.fullName && !this.state.dob && !this.state.phoneNumber) {
      alert(this.props.getLocalizedText("fillOutAllFields"));
      
    }else{
      
        firebase.database().ref('users/'+ uid).update({
          fullName: fullName,
          phoneNumber: phoneNumber,
          dob: dob,
          infant: infant,
          pregnant: pregnant,
          liveMiami: liveMiami,
          babyGender:{
            male: male,
            female: female
          }
  
        }, e => {console.log("Error update: ", e)});
     
      window.alert('your Information has been save');
    }
    
  }else{
    alert("Error: Couldn't get user Information");
  }
 
  
};

componentWillUnmount(){
  this._isMounted = false;
}


componentDidMount(){
  this.fetchUserInfo();
}


 render() {
   const { fullName, dob, phoneNumber, liveMiami, infant, pregnant, babyGender} = this.state;
    return (
      <View style={{ flex: 1 }}>
       <ScrollView>
          <TouchableHighlight
            onPress={this.goBack}
            underlayColor={"transparent"}
            style={{
              height: appStyles.win.height * 0.04,
              marginTop: "12%",
              marginLeft: "3%",
              width: appStyles.win.width * 0.07,
            }}
          >
            <Image
              style={{
                height: appStyles.win.width * 0.06,
                width: appStyles.win.width * 0.06,
              }}
              source={goBackImg}
            />
          </TouchableHighlight>
          <WelcomeUserBanner
            fullName={this.props.fullName}
            logout={this.props.logout}
            getLocalizedText={this.props.getLocalizedText}
          />
          <View style={{ alignItems: 'center', paddingTop: 20}}>
              <Text style={appStyles.blueColor}>{this.props.getLocalizedText("phoneNumberInput")}: {phoneNumber}</Text>
            <View style={appStyles.TextInput.View}>
              <TextBox
                placeholder={this.props.getLocalizedText("phoneNumberInput")}
                style={appStyles.TextInput.TextInput}
                value={phoneNumber}
                keyboardType={"numeric"}
                onChangeText={(e)=> this.onChangeText({phoneNumber: e})}
              />
            </View>

            <Text style={appStyles.blueColor}>{this.props.getLocalizedText("dob")}: {dob}</Text>
            <View>
              <TextInput
                placeholder={this.props.getLocalizedText("dob")}
                style={appStyles.TextInput.TextInput}
                value={dob}
                type={'date'}
                keyboardType={"numeric"}
                onChangeText={(e)=> this.onChangeText({dob: e})}
              />
            </View>

            <Text style={appStyles.blueColor}>{this.props.getLocalizedText("fullName")}: {fullName}</Text>
            <View style={appStyles.TextInput.View}>
              <TextBox
                placeholder={this.props.getLocalizedText("fullName")}
                style={appStyles.TextInput.TextInput}
                value={fullName}
                onChangeText={(e)=> this.onChangeText({fullName: e})}
              />
            </View>
            <View style={{ alignItems: 'center', height:160 }}>
            <Text >{this.props.getLocalizedText("liveMiami")}</Text>
                <Picker
                    selectedValue={liveMiami}
                    style={{width: 100, bottom: 50}}
                    onValueChange={(itemValue, itemIndex) =>
                      this.onChangeText({liveMiami: itemValue})
                    }>
                    <Picker.Item label="Yes" value={true} />
                    <Picker.Item label="No" value={false} />
                  </Picker>
            </View>
            <View style={{ alignItems: 'center', height:160}}>
                  <Text >{this.props.getLocalizedText("areYouPregnant")}</Text>
                <Picker
                    selectedValue={pregnant}
                    style={{width: 100,  bottom: 50}}
                    onValueChange={(itemValue, itemIndex) =>
                      this.onChangeText({pregnant: itemValue})
                    }>
                    <Picker.Item label="Yes" value={true} />
                    <Picker.Item label="No" value={false} />
                  </Picker>
            </View>
            <View style={{alignItems: 'center', height:160}}>
                  <Text >{this.props.getLocalizedText("doYouHaveInfants")}</Text>
                <Picker
                    selectedValue={infant}
                    style={{width: 100, bottom: 50}}
                    onValueChange={(itemValue, itemIndex) =>
                      this.onChangeText({infant: itemValue})
                    }>
                    <Picker.Item label="Yes" value={true} />
                    <Picker.Item label="No" value={false} />
                  </Picker>
            </View>
            <View style={{alignItems: 'center', height:160}}>
                  <Text >{this.props.getLocalizedText("selectGenders")}</Text>
                <Picker
                    selectedValue={(babyGender.male && babyGender.female)}
                    style={{width: 100, bottom: 50}}
                    onValueChange={(itemValue, itemIndex) =>{
                        return this.setState({babyGender:{male: itemValue, female: itemValue}})
                    }}>
                    <Picker.Item label="Male" value={true} key='1' />
                    <Picker.Item label="Female" value={false}  key='2'/>
                 </Picker>
            </View>
        
          </View>
          <View style={{justifyContent: 'center', flexDirection: 'row', padding: 90}}>
            <TouchableHighlight style={appStyles.button.TouchableHighlight} underlayColor={appStyles.blueColor}  
            onPress={() => this.onSubmit(fullName, dob, phoneNumber, infant, pregnant, liveMiami, babyGender)} >
            <Text style={appStyles.button.text}>{this.props.getLocalizedText("save")}</Text>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={() => {
                this.AsyncAlert().then((response) => {
                  response ? this.props.logout() : null;
                });
              }}
              style={appStyles.button.TouchableHighlight}
              underlayColor={appStyles.greyColor}
            >
              <Text style={appStyles.button.text}>{this.props.getLocalizedText("logout")}</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({

});

export default SettingScreen;