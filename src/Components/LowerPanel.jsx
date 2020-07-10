import { View, Animated } from "react-native";
import appStyles from "./AppStyles";
import React, { useState, useEffect } from "react";
import LowerPanelSelection from "./LowerPanelSelection";
import FindCare from "./FindCare";
import Shelters from "./Shelters";

import ClinicInfo from "./ClinicInfo";
import ShelterInfo from "./ShelterInfo";

import LowerPanelHeader from "./LowerPanelHeader";
import Learn from "./Learn";
import Resources from "./ResourcesPage";
import STDInfo from "./STDInfo";
import Appointment from "./Appointment";
import NewAppointment from "./NewAppointment";
import STDSelection from "./STDSelection";
import Documents from "./Documents";
import FemaleCondom from "./FemaleCondom";

export default LowerPanel = props => {


  const [filterToShow, setFilterToShow] = useState(false);
  const [fullPanel, setFullPanel] = useState(props.fullPanel);
  const [moveAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {  //Substitute ComponentDidMount
    //movePanel(true) //Move up

  }, [])

  useEffect(() => {  //Substitute ComponentDidUpdate
    movePanel(fullPanel)
  }, [fullPanel])

  let movePanel = (moveUp) => {
    if (moveUp) {
      //MoveUp
      Animated.timing(moveAnim, {
        toValue: 0,
        duration: 150,
      }).start();
    }
    else if (!moveUp) {
      //Move Down
      Animated.timing(moveAnim, {
        toValue: appStyles.lowerPanel.bottom,
        duration: 150,
      }).start();
    }
  };

  let lowerPanelContent = {
    findCare: <FindCare clinics={props.clinics} sortedClinics={props.sortedClinics} setClinicToView={props.setClinicToView} setClinics={props.setClinics} setFilters={props.setFilters} filters={props.filters} filterToShow={filterToShow} setLowerPanelContent={props.setLowerPanelContent} />,
    shelters: <Shelters shelters={props.shelters} setShelterToView={props.setShelterToView} setLowerPanelContent={props.setLowerPanelContent} />,
    clinicInfo: <ClinicInfo clinic={props.clinicToView} setLowerPanelContent={props.setLowerPanelContent} />,
    shelterInfo: <ShelterInfo shelter={props.shelterToView} setLowerPanelContent={props.setLowerPanelContent} />,
    learn: <Learn setLowerPanelContent={props.setLowerPanelContent} />,
    STDSelection: <STDSelection setLowerPanelContent={props.setLowerPanelContent} setSTDToView={props.setSTDToView} />,
    resources: <Resources setLowerPanelContent={props.setLowerPanelContent} />,
    STDInfo: <STDInfo setLowerPanelContent={props.setLowerPanelContent} STDToView={props.STDToView} />,
    Appointment: <Appointment setLowerPanelContent={props.setLowerPanelContent} />,
    NewAppointment: <NewAppointment setLowerPanelContent={props.setLowerPanelContent} />,
    FemaleCondom: <FemaleCondom setLowerPanelContent={props.setLowerPanelContent} />,
    documents: <Documents setLowerPanelContent={props.setLowerPanelContent} />,
    selection: <LowerPanelSelection fullName={props.fullName} logout={props.logout} setFullPanel={setFullPanel} fullPanel={fullPanel} setLowerPanelContent={props.setLowerPanelContent}  setScreen={props.setScreen}
    />
  }

    return (
      <Animated.View style={{ ...appStyles.lowerPanel, bottom: moveAnim, overflow: "hidden" }}>
        {props.lowerPanelContent !== "selection" && (
          <LowerPanelHeader onPress={() => setFullPanel(!fullPanel)} setFilterToShow = {() => setFilterToShow(!filterToShow)} goBack={props.goBack} lowerPanelContent={props.lowerPanelContent} setFullPanel={setFullPanel} fullPanel={fullPanel}
          />
        )}
        {lowerPanelContent[props.lowerPanelContent]}
      </Animated.View>
    );
  }

