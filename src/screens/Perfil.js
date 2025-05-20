/**
 * Ubix conductor
 *
 * @format
 * @flow
 */

// Dependencies
import React, { useState, useEffect, useContext } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

// Components
import Avatar from '../components/avatar/Avatar';
import { Subtitle2 } from '../components/text/CustomText';
import Button from '../components/buttons/Button';
import Icon from '../components/icon/Icon';

import firebase from '../../firebase';
import FirebaseContext from '../../context/firebase/firebaseContext';
import { DataTable } from 'react-native-paper';

// Config
const IOS = Platform.OS === 'ios';
const CAMERA_ICON = IOS ? 'ios-camera' : 'md-camera';

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  avatarSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FE5000',
    textTransform: 'uppercase',
  },
  datos: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5d5d5d',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

// EditProfileA
export default function Perfil({ navigation }) {
  const [notificacionesInfo, setNotificacionesInfo] = useState([]);
  const [tamano, setTamano] = useState(null);

  const {
    conductorinfo,
    obtenerConductorInfo,
    conductorperfil,
    obtenerConductorPerfil,
  } = useContext(FirebaseContext);

  const conductor = firebase.auth.currentUser; // arreglar
  const conductorID = conductor ? conductor.uid : ''; // arreglar

  useEffect(() => {
    obtenerConductorPerfil(conductorID);

    const unsubscribe = firebase.db
      .collection('conductores')
      .doc(conductorID)
      .collection('notificaciones')
      .onSnapshot(manejarSnapshot);

    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  function manejarSnapshot(snapshot) {
    const notificaciones = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    const size = snapshot.size;
    setTamano(size);
    // console.log(notificaciones);
    // setNotificacionesInfo(notificaciones);
  }

  const logout = () => {
    Alert.alert(
      'Cerrar sesión',
      'Estas seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            await firebase.auth.signOut();
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />

      <View style={styles.avatarSection}>
        {conductorperfil?.imagen ? (
          <Avatar imageUri={conductorperfil.imagen} rounded size={100} />
        ) : (
          <Avatar
            imageUri={require('../assets/profile_1.jpeg')}
            rounded
            size={100}
          />
        )}
      </View>
      <View style={styles.container}>
        <DataTable>
          <DataTable.Header
            style={{
              marginTop: 20,
              fontWeight: 'bold',
            }}
          >
            <DataTable.Title>
              <Text style={styles.titulo}>Nombre</Text>
            </DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styles.datos}>{conductorperfil.nombre}</Text>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Header>
            <DataTable.Title>
              <Text style={styles.titulo}>Email</Text>
            </DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styles.datos}>{conductorperfil.email}</Text>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Header>
            <DataTable.Title>
              <Text style={styles.titulo}>Celular</Text>
            </DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styles.datos}>{conductorperfil.celular}</Text>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Header>
            <DataTable.Title>
              <Text style={styles.titulo}>Placa</Text>
            </DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styles.datos}>{conductorperfil.placa}</Text>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Header>
            <DataTable.Title>
              <Text style={styles.titulo}>Monedero</Text>
            </DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styles.datos}># Ordenes: {tamano}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styles.datos}>Dinero: ${tamano}</Text>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Header>
            <DataTable.Title
              onPress={logout}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 80,
                backgroundColor: '#FE5000',
                borderRadius: 30,
              }}
            >
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </DataTable.Title>
          </DataTable.Header>
        </DataTable>
      </View>
    </SafeAreaView>
  );
}
