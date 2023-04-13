/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, {useState, useContext} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import TextInput from '../../components/TextInput';
import {TouchableOpacity} from 'react-native';
import SecureTextInput from '../../components/SecureTextInput';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useTogglePasswordVisibility} from '../../utils/hooks/useTogglePasswordVisibility';
import {AppContext} from '../../utils/context/AppProvider';
import InfoModal from '../../components/InfoModal';

const screenHeight = Dimensions.get('window').height;

function SignUp() {
  const navigation = useNavigation();

   // user registration function from app context
  const {register} = useContext(AppContext);

  // custom hook for showing and hiding the password
  const {passwordVisibility, rightIcon, handlePasswordVisibility} =
    useTogglePasswordVisibility();


    // custom modal for showing information to user
  const [modal, setModal] = useState({state: false, message: ''});

  const toggleModal = () => {
    setModal({state: false, message: ''});
  };

  //validation schema for logging in
  const validationSchema = Yup.object({
    name: Yup.string().trim().required('Name is required'),
    email: Yup.string()
      .email('Must be a valid email')
      .max(255)
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password is too short - should be 8 characters minimum.')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
      ),
  });

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView>
        <InfoModal
          openDialog={modal.state}
          message={modal.message}
          toggleDialog={toggleModal}
        />
        <Formik
          enableReinitialize={true}
          initialValues={{email: '', password: '', name: ''}}
          validationSchema={validationSchema}
          onSubmit={async (values, {resetForm}) => {
            const result = await register(
              values.email,
              values.password,
              values.name,
            );
            if (result == 'User created successfully') {
              setModal({
                state: true,
                message: 'User created successfully, go to sign in page',
              });
              resetForm();
            } else {
              setModal({state: true, message: result?.message});
            }
          }}>
          {formik => (
            <View style={styles.root}>
              <Text style={styles.header}>SIGN UP</Text>

              <TextInput
                placeholder="Name"
                onChange={text => formik.setFieldValue('name', text)}
                value={formik.values.name}
                label={'Name'}
                errorMessage={formik.touched.name && formik.errors.name}
                onBlur={formik.handleBlur('name')}
              />

              <TextInput
                placeholder="Email ID"
                onChange={text => formik.setFieldValue('email', text)}
                value={formik.values.email}
                label={'Email ID'}
                errorMessage={formik.touched.email && formik.errors.email}
                onBlur={formik.handleBlur('email')}
              />

              <SecureTextInput
                placeholder="Password"
                onChange={text => formik.setFieldValue('password', text)}
                value={formik.values.password}
                showText={passwordVisibility}
                label={'Password'}
                rightIcon={rightIcon}
                handleVisibility={handlePasswordVisibility}
                onBlur={formik.handleBlur('password')}
                errorMessage={formik.touched.password && formik.errors.password}
              />

              <View style={styles.pressableView}>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={formik.handleSubmit}>
                  <Text style={styles.loginText}>SIGN UP</Text>
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      fontFamily: 'Montserrat-Medium',
                      color: '#3B619D',
                    }}>
                    SIGN IN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C9D9EF',
    resizeMode: 'contain',
    height: screenHeight,
  },
  header: {
    color: '#ec9d75',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    letterSpacing: 1,
    marginVertical: 8,
  },
  pressableView: {
    marginVertical: 12,
    alignItems: 'center',
    width: '100%',
  },
  loginButton: {
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Montserrat-Medium',
    backgroundColor: '#ec9d75',
    width: '90%',
    borderColor: '#A6A1C2',
  },
});
