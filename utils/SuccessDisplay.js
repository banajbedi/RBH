import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { View, Text, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';

export function SuccessDisplay(props) {
    if (props.successDisplay) {
        return (
            <View style={styles.container}>
                <Ionicons name="md-checkmark-circle" size={60} color="green" />
                <Text style={styles.text}>Successfully updated</Text>
                <Text style={styles.text}>{props.type} for child {props.childNo} !</Text>

            </View>);
    }
    else {
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        alignSelf: 'center',
        top: 50,
        justifyContent: 'center'
    },
    text: {
        color: '#000000',
        fontSize: 15,
        fontWeight: 'bold',
        borderColor: '#000000'
        },
});