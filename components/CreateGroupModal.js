/* eslint-disable prettier/prettier */
import React, {useContext, useState} from 'react';
import {Dialog, useTheme} from '@rneui/themed';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import TextInput from './TextInput';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/database';
import {AppContext} from '../utils/context/AppProvider';

function CreateGroupModal({openDialog, toggleDialog}) {
  // getting user info from app context
  const {user} = useContext(AppContext);

  //validation schema for creating group created using Yup
  const validationSchema = Yup.object({
    groupName: Yup.string().max(255).required('Group name is required.'),
    groupDescription: Yup.string()
      .min(20)
      .required('Group description is required.'),
  });

  // random group banners while creating groups
  const groupBanners = [
    'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1',
    'https://images.unsplash.com/photo-1676959138786-3fce8e8eae16',
    'https://images.unsplash.com/photo-1677095042861-7708e5a5c99f',
    'https://images.unsplash.com/photo-1677090066793-9df84874b064',
  ];

  // group creation functionality
  const createGroup = async (name, description, creator) => {
    try {
      // Creating ref to groups collection
      const groupRef = await firestore().collection('groups').doc();

      //adding group creator to group by default
      const members = [creator];

      // adding random images as group banner
      const randomIndex = Math.floor(Math.random() * groupBanners.length);
      await groupRef
        .set({
          name,
          description,
          members,
          groupBanner: groupBanners[randomIndex],
        })
        .then(() => {
          // getting id of currently created group and adding same group in realtime database of firebase
          if (groupRef.id) {
            const newGroupRef = firebase
              .app()
              .database(
                'https://social-media-app-393c1-default-rtdb.asia-southeast1.firebasedatabase.app/',
              )
              .ref('/groups/' + groupRef.id);
            newGroupRef.set({
              name: name,
            });
            return 'Group created successfully';
          }
        });
      return 'Group created successfully';
    } catch (err) {
      return err;
    }
  };

  return (
    <Dialog
      isVisible={openDialog}
      onBackdropPress={toggleDialog}
      style={{maxHeight: 200}}>
      <Dialog.Title title="Create Group" />
      <ScrollView scrollEnabled={true}>
        <Formik
          enableReinitialize={true}
          initialValues={{groupName: '', groupDescription: ''}}
          validationSchema={validationSchema}
          onSubmit={async (values, {resetForm}) => {
            let result = await createGroup(
              values.groupName,
              values.groupDescription,
              user.userId,
            );
            console.log(result);
            if (result == 'Group created successfully') {
              resetForm();
              toggleDialog();
            }
          }}>
          {formik => (
            <View style={styles.root}>
              <TextInput
                placeholder="Group name"
                onChange={text => formik.setFieldValue('groupName', text)}
                value={formik.values.groupName}
                label={'Group name'}
                errorMessage={
                  formik.touched.groupName && formik.errors.groupName
                }
                onBlur={formik.handleBlur('groupName')}
              />
              <TextInput
                multiline={true}
                numberOfLines={3}
                placeholder="Group description"
                onChange={text =>
                  formik.setFieldValue('groupDescription', text)
                }
                value={formik.values.groupDescription}
                label={'Group description'}
                errorMessage={
                  formik.touched.groupDescription &&
                  formik.errors.groupDescription
                }
                onBlur={formik.handleBlur('groupDescription')}
              />
              <Dialog.Actions>
                <Dialog.Button
                  titleStyle={{color: '#4974b8'}}
                  title="CREATE"
                  onPress={formik.handleSubmit}
                />
                <Dialog.Button
                  titleStyle={{color: '#4974b8'}}
                  title="CANCEL"
                  onPress={toggleDialog}
                />
              </Dialog.Actions>
            </View>
          )}
        </Formik>
      </ScrollView>
    </Dialog>
  );
}

export default CreateGroupModal;

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    width: 220,
    margin: 20,
  },
  buttonContainer: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
