/* eslint-disable prettier/prettier */
import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as Keychain from 'react-native-keychain';

export const AppContext = createContext();

export const AppProvider = ({children}) => {
  const [user, setUser] = useState(null);

  // storing the data in app context as well as, login, logout, register functionality as well
  // which can be used in the app
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            let response = await auth().signInWithEmailAndPassword(
              email,
              password,
            );
            firestore()
              .collection('users')
              .doc(response.user.uid)
              .onSnapshot(documentSnapshot => {
                let userData = documentSnapshot.data();
                userData = {...userData, userId: response.user.uid};
                setUser(userData);
              });
            await Keychain.setInternetCredentials(
              'socialApp',
              'user-id',
              response.user.uid.toString(),
            );
            return 'Signin successfull';
          } catch (error) {
            return error;
          }
        },
        register: async (email, password, name) => {
          try {
            await auth().createUserWithEmailAndPassword(email, password);
            await firestore()
              .collection('users')
              .doc(auth().currentUser.uid)
              .set({
                name: name,
                email: email,
                createdAt: firestore.Timestamp.fromDate(new Date()),
              });
            return 'User created successfully';
          } catch (error) {
            return error;
          }
        },
        getUserInfo: async userId => {
          try {
            firestore()
              .collection('users')
              .doc(userId)
              .onSnapshot(documentSnapshot => {
                let userData = documentSnapshot.data();
                if (userId && userData) {
                  userData = {...userData, userId: userId};
                }
                setUser(userData);
              });
            return 'User fetched successfully';
          } catch (error) {
            return error;
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (error) {
            return error;
          }
        },
      }}>
      {children}
    </AppContext.Provider>
  );
};
