/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {SearchBar} from '@rneui/themed';

// custom search bar for searching group and messages
function CustomSearchBar({value, onChange, placeholder, usedIn}) {
  return (
    <SearchBar
      containerStyle={[
        styles.searchContainer,
        {width: usedIn == 'Home' ? '80%' : '100%'},
      ]}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.input}
      placeholder={placeholder}
      onChangeText={onChange}
      value={value}
    />
  );
}

export default CustomSearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    borderColor: '#3B619D',
    borderRadius: 8,
    borderWidth: 1,
    width: '80%',
    backgroundColor: 'white',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: 'white',
    color: 'black',
  },
  input: {
    color: 'black',
  },
});
