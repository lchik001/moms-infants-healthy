import React, { useState, useContext } from 'react';
import { View, Image, ScrollView, StyleSheet, Alert, TouchableOpacity, 
        TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import Translator from '../components/Translator';
import Colors from '../constants/Colors';
// Custom Components
import ImagePick from '../components/ImagePick';
import Box from '../components/Box';
import SignUpForm from '../components/SignUp';
import Helpers from '../components/Helpers';
import firebase from 'firebase';
import { Context as AuthContext} from '../context/AuthContext';

//FIX DESIGN

const Profile = props => {

    const lang = GLOBAL_LANGUAGE

    console.log("profile screen language: ", lang)

    const { signout } = useContext(AuthContext);

    // handles the language selection of the app
    const [language, setLanguage] = useState(lang);
    // image default and new one hook
    // const [image, setImage] = useState(props.loadProfile['Image']);
    // TranslatorConfiguration.setConfig(ProviderTypes.Microsoft, 'de6f9f5aaa86420da79a3dc450cd4e6c', language);
    var fnameError = Helpers('Please Input Valid First Name ', language);
    var lnameError = Helpers('Please Input Valid Last Name ', language);
    var phoneError = Helpers('Please Input Valid Phone Number ', language);

    // hold changes in real time
    let profile = props.loadProfile;
    console.log("profile: ", profile)
    // if (profile['Image'] === '') {
    //     setImage('../../assets/mom-and-baby-icon-editable.png');
    // }
    // Navigator
    // const locationHelper = (location) => {
    //     props.onTap(location);
    // }
    const saveChange = () => {
        props.changeLang(language);
        var errors = '';
        var error = false;

        if (profile['Name'] === '' || profile['Name'] === null) {
            errors = errors + fnameError + '\n';
            error = true;
        }
        if (profile['LastName'] === '' || profile['LastName'] === null) {
            errors = errors + lnameError + '\n';
            error = true;
        }
        if (profile['PhoneNumber'] === '' || profile['PhoneNumber'] === null) {
            errors = errors + phoneError + '\n';
            error = true;
        }
        if (error) {
            Alert.alert('', errors,
                [
                    { text: 'OK' },
                ],
                { cancelable: false })
        }
        else {
            profile['Image'] = image;
            props.onSave(profile);
        }
    }
    // New image Handler
    const pictureHandler = (pic) => {
        setImage(pic);
    }

    // Profile Value setter   ----- get the info from the db
    const profileHandler = (profileDetails) => {
        // firebase.database().ref('users' + profile['PhoneNumber']).once('value', (data) => {
        //     console.log(data.toJSON())
        //     console.log(profileDetails)
        // }).then(() => {
        //     console.log("Data retrieved from the db");
        // }).catch((error) => {
        //     console.log(error);
        // })

        profile = profileDetails;
    }

    return (
        <KeyboardAvoidingView
            behavior={'padding'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={-120}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <View>
                    <View style={styles.screen}>
                        <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            {/* User Image View */}
                            <View style={{ marginLeft: 55 }}>
                                <ImagePick passLang={language}  getPicture={pictureHandler} />
                            </View>
                            {/* Folder Touchable */}
                            <TouchableOpacity onPress={() => props.navigation.navigate('Documents')} >
                                <Image style={{ marginLeft: 20 }} source={require('../../assets/icons/documents.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={signout} >
                                <Image style={{ marginLeft: 20 }} source={require('../../assets/icons/sign-out.png')} />
                            </TouchableOpacity>
                        </View>
                        <Box style={{ height: '100%', width: '90%', }}>
                            <ScrollView>
                                {/* Change info */}
                                <SignUpForm loadScreen={('Profile')} loadLanguage={language} getProfile={profileHandler} loadProfile={profile} />
                                {/* Language change */}
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <TouchableOpacity style={{ width: '30%' }} onPress={() => setLanguage('en')}>
                                        <View style={{ opacity: (language === 'en') ? 1 : 0.2 }}>
                                            <Image style={{ height: 50, width: 70, resizeMode: 'stretch' }} source={require('../../assets/icons/usa-flag.png')} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ width: '30%' }} onPress={() => setLanguage('es')}>
                                        <View style={{ opacity: (language === 'es') ? 1 : 0.2 }}>
                                            <Image style={{ height: 50, width: 70, resizeMode: 'stretch' }} source={require('../../assets/icons/spain-flag.png')} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ width: '30%' }} onPress={() => setLanguage('ht')}>
                                        <View style={{ opacity: (language === 'ht') ? 1 : 0.2 }}>
                                            <Image style={{ height: 50, width: 70, resizeMode: 'stretch' }} source={require('../../assets/icons/creole-flag.png')} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                            <View>
                                <TouchableOpacity style={styles.button} underlayColor={'rgba(213, 170, 255, 0.8)'} >
                                    <Translator style={styles.text} loadText={('Save Changes')} loadLanguage={language} />
                                </TouchableOpacity>
                            </View>
                        </Box>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    );
};

Profile.navigationOptions = () => {
    return {
        title: 'Personal Account'
    };
};

const styles = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
    },
    button: {
        marginBottom: 100,
        padding: 10,
        backgroundColor: Colors.boxBackground,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
})

export default Profile;