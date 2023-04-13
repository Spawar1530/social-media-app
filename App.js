/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  BackHandler,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {NavigationContainer} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import MainNavigator from './navigation/MainNavigator';
import {AppProvider} from './utils/context/AppProvider';
import InfoModal from './components/InfoModal';
import SplashScreen from 'react-native-splash-screen';
function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isConnected, setIsConnected] = useState(true);

  const [modal, setModal] = useState({state: false, message: ''});

  const toggleModal = () => {

    //Closing the popup and exiting the application because no internet connectivity

    setModal({state: false, message: ''});
    BackHandler.exitApp();
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    // Here we subscribing to event listner which will check for internet connectivity
    // and listn to change in status of internet connectivity

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected); 
    });
    return () => {
      unsubscribe();
    }
  }, []);

  useEffect(() => {
    //On mount of app we will check for status of internet connection
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
  }, []);

  useEffect(() => {
    // Show pop up for internet is connected
    if (!isConnected) {
      setModal({
        state: true,
        message:
          'Internet is Required, Please check your internet connection and try again.',
      });
    }
  }, [isConnected]);

  useEffect(() => {

    //We are locking orientation to portrait mode as well as hiding the splashscreen on mount of app

    Orientation.lockToPortrait();
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <AppProvider>
        <SafeAreaView style={{flex: 1}}>
          <InfoModal
            openDialog={modal.state}
            message={modal.message}
            toggleDialog={toggleModal}
          />
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <MainNavigator token={null} />
        </SafeAreaView>
      </AppProvider>
    </NavigationContainer>
  );
}

export default App;
