/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import React, {useEffect, useState, useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../views/user/Home';
import SignIn from '../views/authentication/SignIn';
import SignUp from '../views/authentication/SignUp';
import JoinedGroupDetails from '../views/user/JoinedGroupDetails';
import GroupDetails from '../views/user/GroupDetails';
import * as Keychain from 'react-native-keychain';
import {AppContext} from '../utils/context/AppProvider';

const Stack = createStackNavigator();

// main navigator
const MainNavigator = () => {
  const [userId, setUserId] = useState(null);

  // getting user info from app context
  const {user, getUserInfo} = useContext(AppContext);

  // getting the user's  id from secure keychain
  const getUserId = async () => {
    try {
      const credentials = await Keychain.getInternetCredentials('socialApp');
      setUserId(credentials?.password);
    } catch (error) {
      console.log('Error retrieving user ID:', error);
    }
  };

  useEffect(() => {
    getUserId();

    // based on if user information is available in app context we will getch user's again
    if (user == null || user == undefined) {
        getUserInfo(userId);
    }
  }, [user]);

  // based on user's logged in state we will render different stacks
  return (
    <Stack.Navigator initialRouteName={userId ? 'Home' : 'SignIn'}>
      {userId ? (
        <>
          <Stack.Screen
            name="Home"
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: '#525252',
              },
              headerTintColor: '#fff',
            }}
            component={Home}></Stack.Screen>
          <Stack.Screen
            name="JoinedGroupDetails"
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: '#525252',
              },
              headerTintColor: '#fff',
            }}
            component={JoinedGroupDetails}></Stack.Screen>
          <Stack.Screen
            name="GroupDetails"
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: '#525252',
              },
              headerTintColor: '#fff',
            }}
            component={GroupDetails}></Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen
            name="SignIn"
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: '#525252',
              },
              headerTintColor: '#fff',
            }}
            component={SignIn}></Stack.Screen>

          <Stack.Screen
            name="SignUp"
            options={{
              headerShown: false,
              headerStyle: {
                backgroundColor: '#525252',
              },
              headerTintColor: '#fff',
            }}
            component={SignUp}></Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};
export default MainNavigator;
