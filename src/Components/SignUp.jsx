import React from "react";
import {View, AsyncStorage} from "react-native";
import SignUpInfo from "./SignUpInfo";
import LetsGetStarted from "./LetsGetStarted";
import SignUpPassword from "./SignUpPassword";
import SignUpBabyGender from "./SignUpBabyGender";
import SignUpBabyDob from "./SignUpBabyDob";
import Firebase from "./Firebase";
import SignUpContact from "./SignUpContact";
import SignUpLoading from "./SignUpLoading";
import SignUpYesorNo from "./SignUpYesorNo";
import MustLiveInMiami from "./MustLiveInMiami";
import SignUpHeader from "./SignUpHeader";


export default class SignUp extends React.Component {



    state = {index: 0, email: null, phoneNumber: null, password: null, fullName: null, dob: null, pregnant: null, infant: null, babyGender: null, liveMiami: null, babyDOB: null};
    showGenderSelection = false;
    showMiamiOnlyAlert = true;

    getNextScreen = () => {
        let currentIndex = this.state.index;

        if (!this.showMiamiOnlyAlert && currentIndex === 1){
            currentIndex++;
        }

        if (!this.showGenderSelection && currentIndex === 7) {
            currentIndex++;
        }

        if (currentIndex < this.screens.length - 1){
            currentIndex++;
        }

        this.setState({index: currentIndex})
    };

    goBack = () => {
        let index = this.state.index;

        if (!this.showMiamiOnlyAlert && index === 3){
            index--;
        }

        if (!this.showGenderSelection && index === 9) {
            index--;
        }
        index--;
        
        this.setState({index: index})
    }

    isEquivalent = (a, b) => {
        // Create arrays of property names
        let aProps = Object.getOwnPropertyNames(a);
        let bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length !== bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    };

    setUserInfo = (keyToValue) => {
        if (this.isEquivalent(keyToValue, {pregnant: true}) || this.isEquivalent(keyToValue, {infant: true})) {
            this.showGenderSelection = true;
        }

        if (this.isEquivalent(keyToValue, {liveMiami: true})) {
            this.showMiamiOnlyAlert = false;
        }

        this.setState(keyToValue);

    };

    signUpAndUploadData = () => {
        let fb = new Firebase();
        let info = this.getNextWeekAndWeekNo();
        fb.signUp(this.state.email, this.state.phoneNumber, this.state.password, this.state.fullName, 
            this.state.dob, this.state.pregnant, this.state.infant, this.state.babyGender, this.state.babyDOB, ...info);
        //Unbinds Async Storage keys used in sign up after successful sign up
        let keys = ['name', 'dob', 'e-mail', 'phone', 'pass', 'repeat', 'babyDOB'];
        AsyncStorage.multiRemove(keys, (err) => {console.log(err)});
        setTimeout( () => {
            this.props.login(this.state.email, this.state.password)
        }, 2000);
    };

    getNextWeekAndWeekNo = () => {
        let babyDOB = new Date(this.state.babyDOB); 
        let today = new Date(); 
        let daysDifference = (today.getTime() - babyDOB.getTime()) / (1000 * 3600 * 24) | 0;
        let daysTillNextWeek = (7 - daysDifference % 7) % 7;        
        let nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysTillNextWeek);
        let nextWeek = (nextweek.getMonth()+1).toString().padStart(2, "0") +'/'+nextweek.getDate().toString().padStart(2, "0") +'/'+ nextweek.getFullYear()
        let weekNo = daysTillNextWeek === 0 ? (daysDifference / 7)  | 0 : ((daysDifference / 7) + 1) | 0;
        if (weekNo > 24) { nextWeek = null; weekNo = null }
        return [nextWeek, weekNo]
    }

    componentDidUpdate = () => {
        if (this.state.index < 0 ) {
            this.props.setAppState({screen: 'login'})
        }
        
    }

    componentWillUnmount() {
        clearInterval(this.interval);
      }

    screens = [
        <LetsGetStarted setUserInfo={this.setUserInfo} getNextScreen={this.getNextScreen} getLocalizedText={this.props.getLocalizedText}/>,
        <SignUpYesorNo setUserInfo={this.setUserInfo} question={this.props.getLocalizedText("liveMiami")} value={"liveMiami"} getNextScreen={this.getNextScreen} getLocalizedText={this.props.getLocalizedText}/>,
        <MustLiveInMiami getNextScreen={this.getNextScreen} getLocalizedText={this.props.getLocalizedText}/>,
        <SignUpInfo setUserInfo={this.setUserInfo} getNextScreen={this.getNextScreen} getLocalizedText={this.props.getLocalizedText}/>,
        <SignUpContact setUserInfo={this.setUserInfo} getNextScreen={this.getNextScreen} getLocalizedText={this.props.getLocalizedText} email= {this.state.email}/>,
        <SignUpPassword setUserInfo={this.setUserInfo} getNextScreen={this.getNextScreen} getLocalizedText={this.props.getLocalizedText}/>,
        <SignUpYesorNo setUserInfo={this.setUserInfo} question={this.props.getLocalizedText("areYouPregnant")} value={"pregnant"} getNextScreen={this.getNextScreen} getLocalizedText={this.props.getLocalizedText}/>,
        <SignUpYesorNo setUserInfo={this.setUserInfo} question={this.props.getLocalizedText("doYouHaveInfants")} value={"infant"} getNextScreen={this.getNextScreen} getLocalizedText={this.props.getLocalizedText}/>,
        <SignUpBabyGender setUserInfo={this.setUserInfo} getNextScreen={this.getNextScreen} getLocalizedText={this.props.getLocalizedText}/>,
        <SignUpBabyDob setUserInfo={this.setUserInfo} getNextScreen={this.getNextScreen} getLocalizedText={this.props.getLocalizedText}/>,
        <SignUpLoading signUpAndUploadData={this.signUpAndUploadData} getLocalizedText={this.props.getLocalizedText}/>
    ];

    render() {
        let male = this.state.babyGender ? this.state.babyGender.male : false;
        let female = this.state.babyGender ? this.state.babyGender.female : false;
        return (
            
            <View style={{height: '100%'}}>
                <SignUpHeader goBack= {this.goBack} male = {male} female = {female} index = {this.state.index}/>
                {this.screens[this.state.index]}
            </View>


        )
            
    }
};