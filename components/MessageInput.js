/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Input} from '@rneui/themed';

// message input for sending the messages
function MessageInput({
  value,
  placeholder,
  onChange,
  handleSend,
}) {
  return (
    <View style={styles.root}>
      <Input
        rightIcon={{
          type: 'font-awesome',
          name: "send",
          onPress: handleSend,
        }}
        inputContainerStyle={{
          borderColor: '#3B619D',
          borderRadius: 8,
          borderWidth: 1,
          width: '100%',
        }}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder}
      />
    </View>
  );
}

export default MessageInput;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    position:"absolute",
    bottom:0
  },
});
