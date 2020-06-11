import React, {useState} from 'react';
import {ScrollView, View} from "react-native";
import SelectionButtonImageOnRight from "./ClinicSelectionButton";
import clinicLogo from '../../assets/clinic-logo.png';
import {Dropdown} from "react-native-material-dropdown"

export default function FindCare(props) {
    const [service, setService] = useState(props.filter);
    const [dist, setDist] = useState('All');

    let clinicsButtons = props.clinics.map((clinic, key) =>
        <SelectionButtonImageOnRight key={key}
                                     icon={clinicLogo}
                                     onPress={() => {
                                        props.setClinicToView(clinic);
                                        props.setLowerPanelContent('clinicInfo');
                                     }}
                                     clinic={clinic}/>);

    let clinics = props.sortedClinics;

    
    //To apply both filters you have to start at sortedClinics, then filter by distance, then filter by services
    //So filterClinics(distFilter, servFilter) when you call it like filterClinics(value, filterS) or filterClinics(filterD, value)                                

    let filterClinics = (filter) => {
        if (filter !== 'All' && clinics) {
            clinics = clinics.filter((item) => item.services.includes(filter))
        }
        props.setClinics(clinics)
        props.setFilter(filter)
        setValue(filter);
    }

    let servicesArray = ["All", "Education", "Support & Counseling", "Free Materials", "Referrals", "STD Tests", "STD Treatment", "Yearly Exam", "Pregnancy Tests", 
                            "Ultrasound", "Immunization", "Abortions", "Medical Care", "Lab services"];
    
    let services = servicesArray.map ((service) => 
        ({label: service, value: service}))  //Change label to adjust for different languages

    // let filterClinicsByDistance= (filterValue) =>{
    //     if (filterValue !== 10000 && clinics) {
    //         clinics = clinics.filter(function (x) {
    //             return x.distance <= filterValue
    //         });
    //     }
    //     console.log(distanceValue);
    //     console.log(serviceValue);
    //     props.setClinics(clinics)
    //     setValue(filterValue);
    // }

        

    let distances = [ {label: 'All',value: 10000}, {label: '5 Miles',value: 5.5}, {label: '15 Miles',value: 15.5}, {label: '20 Miles',value: 20.5} ]

    return (
        <>
        <View style={{flexDirection: "row"}}>
            { <Dropdown containerStyle= {{width: '30%', right: '50%'}} dropdownOffset= {{top: 0, bottom: 0, left: 0}} fontSize= {12} data={distances} 
            label="Distance" value= {distanceValue} itemColor={'red'} useNativeDriver={true} onChangeText={(value,index,data)=>filterClinicsByDistance(value)} /> }
            <Dropdown containerStyle= {{width: '30%', left: '50%'}} dropdownOffset= {{top: 0, bottom: 0,left: 5, right: 0}} fontSize= {12} data={services} 
            label="Services" value= {serviceValue} itemColor={'red'} useNativeDriver={true} onChangeText={(value,index,data)=>filterClinicsByService(value)} />
        </View>
            <ScrollView contentContainerStyle={{alignItems: 'center', maxWidth: '100%'}}>
                
                {clinicsButtons}
            </ScrollView>
       </>
    )
}