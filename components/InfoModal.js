/* eslint-disable prettier/prettier */
import React from 'react';
import {Dialog, Text} from '@rneui/themed';
import {StyleSheet, View } from 'react-native';

function InfoModal({openDialog, toggleDialog, message}) {

  // simple information modal for showing data to user
  return (
    <Dialog
      isVisible={openDialog}
      onBackdropPress={toggleDialog}
      style={{maxHeight: 200}}>
      <View >
        <Text style={styles.message}>
            {message}
        </Text>
        <Dialog.Actions>
          <Dialog.Button
            titleStyle={{color: '#4974b8'}}
            title="OK"
            onPress={toggleDialog}
          />
        </Dialog.Actions>
      </View>
    </Dialog>
  );
}

export default InfoModal;

const styles = StyleSheet.create({
  message:{
    fontSize:18,
    fontFamily:"Montserrat-Medium"
  }
});
