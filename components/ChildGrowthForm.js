import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView} from 'react-native';
import {Formik} from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';
import {base_url, putDataAsync} from '../constants/Base';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";

const ChildGrowthSchema = yup.object({
    AssessmentDate: yup.string().required(),
    Height: yup.number().required(),
    Weight: yup.number().required(),
    GeneralHealth: yup.string().required(),
    Comments: yup.string()
})

var date = new Date().getDate(); //Current Date
var month = new Date().getMonth() + 1; //Current Month
var year = new Date().getFullYear(); //Current Year

export default class ChildGrowth extends React.Component{
constructor(props){
super(props);
this.state ={
AssessmentOn:'',
showAD: false,
submitAlertMessage: '',
child: this.props.navigation.getParam('child'),
isVisible: false,
loading: false,
errorDisplay: false,
sucessDisplay: false
}
}
showAssessmentDatePicker = () => {
    this.setState({
      showAD: true
    });
  };

_pickAssessmentDate = (event, date, handleChange) => {
        console.log(date);
        let a = moment(date).format('YYYY-MM-DD');
        console.log(a);
        console.log(typeof (a));
        this.setState({
            AssessmentOn: a, showAD: false
        });
        handleChange(a);
    }

    submitChildGrowthForm(values) {
        this.setState({ loading: true });
        let request_body = JSON.stringify({
                "childNo": this.state.child.childNo,
                "healthDate":values.AssessmentDate,
                "height":values.Height,
                "weight":values.Weight,
                "generalHealth":values.GeneralHealth,
                "comments":values.Comments,
                "healthStatus": values.HealthStatus
        });
        let result = {};
        fetch(base_url+"/child-health", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({ successDisplay: true });
            this.setState({ loading: false, isVisible: true });
            console.log(responseJson);
            this.setState({submitAlertMessage: 'Successfully added child growth details '});
        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to add child growth details. Please contact the Admin.'});
            this.setState({ errorDisplay: true });
            console.log(error);
        });
    }

    render() {
        return (

            <View style={globalStyles.formcontainer}>
             <Text style ={globalStyles.healthformheading}>        Child Growth Form         </Text>
                <Formik
                initialValues = {
                    {
                        AssessmentDate: this.state.AssessmentOn,
                        Height: '',
                        Weight: '',
                        GeneralHealth: '',
                        Comments: '',
//                        CreatedBy: 'admin',
//                        ModifiedBy: 'admin',
//                        CreatedDate: date + '/' + month + '/' + year,
//                        ModifiedDate: date + '/' + month + '/' + year,
                        HealthStatus: '1'
                    }
                }
                validationSchema = {ChildGrowthSchema}
                onSubmit = {async (values, actions) => {
                    console.log(values);
                    this.setState({
                    AssessmentOn:''
                    });
                     this.submitChildGrowthForm(values);
                    actions.resetForm();

                }}
                >
   {props => (
               <ScrollView showsVerticalScrollIndicator = {false}>
               <View >
               <Text style = {globalStyles.textform}>Assessment Date</Text>
                    <View style={globalStyles.dobView}>
                                             <TextInput
                                              style={globalStyles.inputform, globalStyles.dobValue}
                                              value={this.state.AssessmentOn}
                                              onValueChange={props.handleChange('AssessmentDate')}
                                              />
                                             <TouchableHighlight onPress={this.showAssessmentDatePicker}>
                                               <View>
                                               <Feather style={globalStyles.dobBtn} name="calendar" />
                                               </View>
                                               </TouchableHighlight>
                                               <Text style={globalStyles.errormsgform}>{props.touched.AssessmentDate && props.errors.AssessmentDate}</Text>
                                                                                {this.state.showAD &&
                                                                                    <DateTimePicker
                                                                                        style={{ width: 100 }}
                                                                                        mode="date" //The enum of date, datetime and time
                                                                                        value={new Date()}
                                                                                        mode={'date'}
                                                                                        onChange={(e, date) => this._pickAssessmentDate(e, date, props.handleChange('AssessmentDate'))}
                                                                                    />
                                                                                }
                    </View>

               <Text style = {globalStyles.text}>Height(Cm)</Text>
                    <TextInput  style={globalStyles.inputText} value = {props.values.Height} onChangeText={props.handleChange("Height")} onBlur={props.handleBlur("Height")}></TextInput>
                    <Text style={globalStyles.errormsgform}>
                    {props.touched.Height && props.errors.Height}
                    </Text>
               <Text style = {globalStyles.text}>Weight(Kg)</Text>
                    <TextInput style={globalStyles.inputText}  value = {props.values.Weight} onChangeText={props.handleChange("Weight")} onBlur={props.handleBlur("Weight")}></TextInput>
                    <Text style={globalStyles.errormsgform}>
                    {props.touched.Weight && props.errors.Weight}
                    </Text>
               <Text style = {globalStyles.text}>General Health</Text>
                   <Picker
                    selectedValue = {props.values.GeneralHealth}
                    onValueChange = {value => {
                                                props.setFieldValue('GeneralHealth', value)
                                               }}
                    style = {globalStyles.dropDown}
                    >
                       <Picker.Item label="Select General Health" value="" />
                       {global.generalHealth.map((item) => {
                            return <Picker.Item key = {item.generalHealthID} label = {item.generalHealth} value = {item.generalHealthID}/>
                       })}
                    </Picker>
                    <Text style={globalStyles.errormsgform}>
                    {props.touched.GeneralHealth && props.errors.GeneralHealth}
                    </Text>
               <Text style = {globalStyles.text}>Comments</Text>
                    <TextInput style={globalStyles.inputText} multiline={true} value = {props.values.Comments} onChangeText={props.handleChange("Comments")} onBlur={props.handleBlur("Comments")}></TextInput>
                    <Text style={globalStyles.errormsgform}>
                    {props.touched.Comments && props.errors.Comments}
                    </Text>

               <Text style = {globalStyles.text}>Health Status</Text>
                     <TextInput  style={globalStyles.inputText} value = {props.values.HealthStatus}  onBlur={props.handleBlur("HealthStatus")}></TextInput>
                      <Text style={globalStyles.errormsgform}>
                      {props.touched.HealthStatus && props.errors.HealthStatus}
                      </Text>
               <Button  title="Submit" onPress={props.handleSubmit} />
               </View>
               </ScrollView>
              )
   }
    </Formik>
    <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                        <View style={globalStyles.MainContainer}>
                            <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                            <SuccessDisplay successDisplay={this.state.successDisplay} type='Status' childNo={this.state.child.firstName}/ >
                        </View>
    </Modal>
    <LoadingDisplay loading={this.state.loading}/>
    </View>
    );
    }
}
