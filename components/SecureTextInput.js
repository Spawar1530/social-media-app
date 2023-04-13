/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Input} from '@rneui/themed';

function SecureTextInput({
  value,
  placeholder,
  errorMessage,
  onChange,
  showText,
  handleVisibility,
  onBlur,
  rightIcon
}) {

  //secure text input for taking user's password, where user can show and hide password
  return (
    <View style={styles.root}>
      <Input
        rightIcon={
          showText
            ? {type: 'font-awesome', name: rightIcon, onPress: handleVisibility}
            : {type: 'font-awesome', name: rightIcon, onPress: handleVisibility}
        }
        secureTextEntry={showText}
        inputContainerStyle={{
          borderColor: '#3B619D',
          borderRadius: 8,
          borderWidth: 1,
          width: '100%',
        }}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder}
        errorStyle={{color: 'red'}}
        errorMessage={errorMessage}
        onBlur={onBlur}
      />
    </View>
  );
}

export default SecureTextInput;

const styles = StyleSheet.create({
  root: {
    width: '95%',
  },
});
