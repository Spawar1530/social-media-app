/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {Icon} from '@rneui/themed';
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';

// top bar for showing inside group details
export default function TopBar({
  title,
  onPress,
}) {
  return (
    <View
      style={{
        backgroundColor: '#4974b8',
        flexDirection: 'row',
        width: '100%',
        height: Dimensions.get('window').height / 18,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{position: 'absolute', left: 12}}>
        <TouchableOpacity onPress={onPress}>
          <Icon type="ionicon" name="arrow-back" color="white" />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          color: 'white',
          fontFamily: 'Montserrat-Medium',
          fontSize: 16,
        }}>
        {title}
      </Text>
    </View>
  );
}
