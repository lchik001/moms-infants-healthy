import React from 'react';
import Maps from "./Maps";
import {View} from 'react-native';
import LowerPanel from "./LowerPanel";
import SOSButton from "./SOSButton";
import appStyles from "./AppStyles";
import Clinics from "./Clinics";



export default class Homepage extends React.Component {

    state = {fullPanel: true, clinics: Clinics(), clinicToView: null};

    setFullPanel = (fullPanel) => {
        this.setState({fullPanel: fullPanel})
    };

    setClinicToView = (clinic) => {
        console.log(clinic)
        this.setState({clinicToView: clinic})
    };

    render() {
        console.log(this.props.fullName);
        return (
            <View style={appStyles.container}>
                <Maps onPress={() => this.setFullPanel(false)}
                      clinics={Clinics()}/>
                <SOSButton/>
                <LowerPanel setFullPanel={this.setFullPanel}
                            fullPanel={this.state.fullPanel}
                            fullName={this.props.fullName}
                            logout={this.props.logout}
                            clinics={this.state.clinics}
                            clinicToView={this.state.clinicToView}
                            setClinicToView={this.setClinicToView}/>
            </View>
        )
    }
}