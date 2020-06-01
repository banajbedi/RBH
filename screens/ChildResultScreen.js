import React from 'react';
import {
    Button, Text, TextInput, View, Picker, ScrollView, KeyboardAvoidingView, Image
} from 'react-native';
import { Formik } from 'formik';
import { globalStyles } from '../styles/global';
import UpdateApi from "../constants/UpdateApi";
import Modal from 'react-native-modal';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { SuccessDisplay } from "../utils/SuccessDisplay";

export default class ChildResultScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            child: this.props.navigation.getParam('child'),
        }
    }
    examResultsubmit(values) {
        this.setState({ loading: true });
        let request_body = JSON.stringify({
            "childNo": this.state.child.childNo,
            "examId": values.Class,
            "appeared": values.Appeared,
            "result": values.Result,
            "percentage": values.Percentage,
        });
        console.log(values);
        const path = `exam-results`;
        UpdateApi.addData(request_body, path).then((response) => {
            this.setState({ loading: false, isVisible: true });
            if (response.ok) {
                response.json().then((res) => {
                    console.log(res + "res");
                });
                this.setState({ successDisplay: true });

            } else {
                throw Error(response.status);
            }
        }).catch(error => {
            console.log(error, 'ffff');
            this.setState({ errorDisplay: true });

        });

    }
    componentWillUnmount() {
        if (this.state.successDisplay) {
            const { params } = this.props.navigation.state;
            params.refreshChildList();
        }

    }
    render() {
        return (<View style={globalStyles.container}>
            <View style={globalStyles.backgroundlogoimageview}>
                <Image source={require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage} />
            </View>

            <Formik
                initialValues={
                    {
                        Appeared: '',
                        Result: '',
                        Percentage: '',
                    }
                }

                onSubmit={async (values, actions) => {
                    console.log(values);
                    console.log("Submit method called here ");
                    this.setState({ showLoader: true, loaderIndex: 10 });
                    let result = this.examResultsubmit(values);
                    let alertMessage = this.state.submitAlertMessage;
                    console.log(result);
                    actions.resetForm();
                }}
            >
                {props => (
                    <KeyboardAvoidingView behavior="padding"
                        enabled style={globalStyles.keyboardavoid}
                        keyboardVerticalOffset={200}>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View>
                                {/*Child Name*/}
                                <Text style={globalStyles.label}>Child Name: </Text>
                                <TextInput
                                    style={globalStyles.disabledBox}
                                    value={this.state.child.firstName} //value updated in 'values' is reflected here
                                    editable={false}
                                    selectTextOnFocus={false}
                                />

                                {/*Child Class*/}
                                <Text style={globalStyles.label}>Class:</Text>
                                <Picker
                                    selectedValue={props.values.Class}
                                    style={globalStyles.dropDown}
                                    onValueChange={props.handleChange('Class')}
                                >
                                    <Picker.Item color='grey' label="Select the Class" value="" />
                                    <Picker.Item label="X" value="11" />
                                    <Picker.Item label="XII(Inter 2/PUC2)" value="13" />
                                </Picker>

                                {/*Appeared*/}
                                <Text style={globalStyles.label}>Appeared:</Text>
                                <Picker
                                    selectedValue={props.values.Appeared}
                                    style={globalStyles.dropDown}
                                    onValueChange={props.handleChange('Appeared')}
                                >
                                    <Picker.Item color='grey' label="Select" value="" />
                                    <Picker.Item label="Yes" value="Y" />
                                    <Picker.Item label="No" value="N" />
                                </Picker>

                                {/*Result*/}
                                <Text style={globalStyles.label}>Result:</Text>
                                <Picker
                                    selectedValue={props.values.Result}
                                    style={globalStyles.dropDown}
                                    onValueChange={props.handleChange('Result')}
                                >
                                    <Picker.Item color='grey' label="Select" value="" />
                                    <Picker.Item label="Pass" value="PASS" />
                                    <Picker.Item label="Fail" value="FAIL" />
                                </Picker>

                                {/*Percentage*/}
                                <Text style={globalStyles.label}>Percentage:</Text>
                                <TextInput
                                    style={globalStyles.input}
                                    onChangeText={props.handleChange('Percentage')}
                                    value={props.values.Percentage}
                                />
                                <Text style={globalStyles.padding}></Text>
                                <Button style={globalStyles.button} title="Submit" onPress={props.handleSubmit} />

                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>

                )}

            </Formik>
            <Modal style={globalStyles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                <View style={globalStyles.MainContainer}>
                    <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                    <SuccessDisplay successDisplay={this.state.successDisplay} type='Status' childNo={this.state.child.firstName} />
                </View>
            </Modal>
            <LoadingDisplay loading={this.state.loading} />
        </View >
        );
    }
}