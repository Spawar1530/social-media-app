/* eslint-disable prettier/prettier */
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {Text, Card, Button, Icon, ListItem, Avatar} from '@rneui/themed';
import TopBar from '../../components/TopBar';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/database';
import {AppContext} from '../../utils/context/AppProvider';
import InfoModal from '../../components/InfoModal';

function GroupDetails() {
  const navigation = useNavigation();

  // getting the group id from navigation state
  const {groupId} = useRoute().params;
  const [groupInformation, setGroupInformation] = useState({});

  // getting the user's information based from app context
  const {user} = useContext(AppContext);

  // custom modal and navigation functionality
  const [modal, setModal] = useState({state: false, message: ''});

  const toggleModal = () => {
    setModal({state: false, message: ''});
    navigation.goBack();
  };

  // adding user to group as well as to realtime database
  const addUserToGroup = async (groupID, userID) => {
    const groupRef = firestore().collection('groups').doc(groupID);
    const group = await groupRef.get();
    if (group.exists) {
      const data = group.data();
      if (!data.members.includes(userID)) {
        const members = [...data.members, userID];
        await groupRef.update({members});
        const newGroupRef = firebase
          .app()
          .database(
            'https://social-media-app-393c1-default-rtdb.asia-southeast1.firebasedatabase.app/',
          )
          .ref('/groups/' + groupID + '/users/' + userID);
        await newGroupRef.set(true);
        return true;
      }
    }
    return false;
  };

  // fetching the groups information based on group id
  useEffect(() => {
    const groupRef = firestore().collection('groups').doc(groupId);
    const memberRef = firestore().collection('users');
    groupRef
      .get()
      .then(doc => {
        if (doc.exists) {
          const groupData = doc.data();
          const userPromises = groupData?.members.map(userId =>
            memberRef
              .doc(userId)
              .get()
              .then(userDoc => {
                if (userDoc.exists) {
                  return userDoc.data();
                } else {
                  return null;
                }
              })
              .catch(err => console.log("Error while retreiving user's info")),
          );
          Promise.all(userPromises)
            .then(users => {
              const updatedGroupData = {...groupData, users: users};
              setGroupInformation(updatedGroupData);
            })
            .catch(err => console.log("Error while retreiving user's info"));
        } else {
          console.log('No such document!');
        }
      })
      .catch(error => {
        console.log('Error getting document:', error);
      });
  }, [groupId]);

  return (
    <View style={styles.root}>
      <TopBar title="Group Details" onPress={() => navigation.goBack()} />
      <InfoModal
        openDialog={modal.state}
        message={modal.message}
        toggleDialog={toggleModal}
      />
      <Card>
        <ScrollView
          scrollEnabled
          style={{maxHeight: Dimensions.get('screen').height}}>
          <Card.Title style={styles.title}>{groupInformation?.name}</Card.Title>
          <Card.Divider />
          <Card.Image
            style={styles.image}
            source={{
              uri: groupInformation?.groupBanner,
            }}
          />
          <Text style={styles.content}>{groupInformation?.description}</Text>
          <Button
            buttonStyle={styles.cardButton}
            title="JOIN NOW"
            onPress={async () => {
              const success = await addUserToGroup(groupId, user.userId);
              if (success) {
                setModal({
                  state: true,
                  message: 'You have joined group successfully.',
                });
              } else {
                setModal({
                  state: true,
                  message: 'You are already member of the group.',
                });
              }
            }}
          />
          <Text style={styles.subHeader}>Users</Text>

          {groupInformation?.users?.map(user => (
            <ListItem bottomDivider>
              <Avatar
                rounded
                title={user?.name[0]}
                containerStyle={{backgroundColor: 'grey'}}
              />
              <ListItem.Content>
                <ListItem.Title>{user?.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </ScrollView>
      </Card>
    </View>
  );
}

export default GroupDetails;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#C9D9EF',
  },
  content: {
    color: 'black',
    marginBottom: 10,
  },
  image: {
    padding: 0,
  },
  title: {
    fontSize: 28,
  },
  subHeader: {
    fontSize: 18,
    marginVertical: 8,
  },
  cardButton: {
    borderRadius: 8,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    backgroundColor: '#ec9d75',
    borderColor: '#A6A1C2',
  },
  icon: {
    marginRight: 10,
  },
  view: {
    margin: 10,
  },
});
