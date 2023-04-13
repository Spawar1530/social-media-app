/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Input} from '@rneui/themed';

// normal text input for taking user's information
function TextInput({
  value,
  placeholder,
  errorMessage,
  onChange,
  onBlur,
  multiline,
  numberOfLines,
}) {
  return (
    <View style={styles.root}>
      <Input
        multiline={multiline}
        numberOfLines={numberOfLines}
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

export default TextInput;

const styles = StyleSheet.create({
  root: {
    width: '95%',
  },
});
