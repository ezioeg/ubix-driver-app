/**
 * Ubix conductor
 *
 * @format
 * @flow
 */

// Dependencies
import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import Button from '../components/buttons/Button';
import UnderlinePasswordInput from '../components/textinputs/UnderlinePasswordInput';
import UnderlineTextInput from '../components/textinputs/UnderlineTextInput';
import ActivityIndicatorModal from '../components/modals/ActivityIndicatorModal';

// Email validation
import { validateEmail } from '../utils/Validation';

// Firebase for auth
import firebase from '../../firebase';

// SignInA Config
const PLACEHOLDER_TEXT_COLOR = 'rgba(0, 0, 0, 0.4)';
const INPUT_TEXT_COLOR = 'rgba(0, 0, 0, 0.87)';
const INPUT_BORDER_COLOR = 'rgba(0, 0, 0, 0.2)';
const INPUT_FOCUSED_BORDER_COLOR = '#000';
const BUTTON_HEIGHT = 48;
const BUTTON_BORDER_RADIUS = 4;

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainerStyle: { flex: 1 },
  content: {
    marginTop: 130,
  },
  form: {
    paddingHorizontal: 18,
  },
  inputContainer: { marginBottom: 7 },
  buttonContainer: { paddingTop: 23 },
});

// SignInA
export default class SignInA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailFocused: false,
      password: '',
      passwordFocused: false,
      codigo: '',
      codigoFocused: false,
      secureTextEntry: true,
      modalVisible: false, // new add
    };
  }

  // Login with firebase
  signInUser = async (email, password, codigo) => {
    if (!email || !password || !codigo) {
      Alert.alert(
        'Error de validación',
        'Todos los campos son obligatorios',
        [{ text: 'OK' }],
        {
          cancelable: false,
        },
      );

      return;
    }
    if (!validateEmail(email)) {
      Alert.alert(
        'Error de validación',
        'El email no es correcto',
        [{ text: 'OK' }],
        {
          cancelable: false,
        },
      );

      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Error de validación',
        'Su clave debe tener minimo 6 caracteres',
        [{ text: 'OK' }],
        {
          cancelable: false,
        },
      );

      return;
    }

    this.setState({
      modalVisible: true,
    });

    // Verifica el codigo del conductor
    await firebase.db
      .collection('conductores')
      .where('codigocon', '==', codigo)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {
          // console.log(doc.id, ' => ', doc.data().codigo);
          await firebase.auth
            .signInWithEmailAndPassword(email, password)
            .catch(() =>
              Alert.alert(
                'Error de autentificación',
                'Email o contraseña incorrecta',
                [{ text: 'OK' }],
                {
                  cancelable: false,
                },
              ),
            );
        });
      })
      .catch(() => {
        Alert.alert(
          'Error de verificación',
          'Código no valido',
          [{ text: 'OK' }],
          {
            cancelable: false,
          },
        );
      });

    this.setState({
      modalVisible: false,
    });
  };

  emailFocus = () => {
    this.setState({
      emailFocused: true,
      passwordFocused: false,
      codigoFocused: false,
    });
  };

  passwordFocus = () => {
    this.setState({
      passwordFocused: true,
      emailFocused: false,
      codigoFocused: false,
    });
  };

  codigoFocus = () => {
    this.setState({
      codigoFocused: true,
      emailFocused: false,
      passwordFocused: false,
    });
  };

  onTogglePress = () => {
    const { secureTextEntry } = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  navigateTo = (screen) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };

  render() {
    const {
      email,
      emailFocused,
      password,
      passwordFocused,
      codigo,
      codigoFocused,
      secureTextEntry,
      modalVisible,
    } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainerStyle}
        >
          <View style={styles.content}>
            <View style={styles.form}>
              <UnderlineTextInput
                onRef={(r) => {
                  this.email = r;
                }}
                onChangeText={(email) => this.setState({ email })}
                onFocus={this.emailFocus}
                inputFocused={emailFocused}
                onSubmitEditing={this.focusOn(this.password)}
                returnKeyType="next"
                blurOnSubmit={false}
                keyboardType="email-address"
                placeholder="Correo electrónico"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputContainerStyle={styles.inputContainer}
              />

              <UnderlinePasswordInput
                onRef={(r) => {
                  this.password = r;
                }}
                onChangeText={(password) => this.setState({ password })}
                onFocus={this.passwordFocus}
                inputFocused={passwordFocused}
                onSubmitEditing={this.focusOn(this.codigo)}
                returnKeyType="next"
                placeholder="Contraseña"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                secureTextEntry={secureTextEntry}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                toggleVisible={password.length > 0}
                toggleText={
                  secureTextEntry ? (
                    <Icon name="eye" size={24} />
                  ) : (
                    <Icon name="eye-off" size={24} />
                  )
                }
                onTogglePress={this.onTogglePress}
              />

              <UnderlineTextInput
                onRef={(r) => {
                  this.codigo = r;
                }}
                onChangeText={(codigo) => this.setState({ codigo })}
                onFocus={this.codigoFocus}
                inputFocused={codigoFocused}
                returnKeyType="done"
                placeholder="Codigo"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputContainerStyle={styles.inputContainer}
              />

              <View style={styles.buttonContainer}>
                <Button
                  onPress={() =>
                    this.signInUser(
                      this.state.email,
                      this.state.password,
                      this.state.codigo,
                    )
                  }
                  activeOpacity={0.8}
                  height={BUTTON_HEIGHT}
                  borderRadius={BUTTON_BORDER_RADIUS}
                  title={'Iniciar sesión'.toUpperCase()}
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <ActivityIndicatorModal
          message="Por favor espere . . ."
          // onRequestClose={}
          title="Iniciando"
          visible={modalVisible}
        />
      </SafeAreaView>
    );
  }
}
