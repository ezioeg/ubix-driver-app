/**
 * Ubix conductor
 *
 * @format
 * @flow
 */

import React, { useState, useEffect, useContext, Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList,
  Button,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';

import firebase from '../../firebase';
import FirebaseContext from '../../context/firebase/firebaseContext';
import OneSignal from 'react-native-onesignal';
import { Card, Title, Paragraph } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  notificationContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginTop: 6,
    marginBottom: 6,
    elevation: 6,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
    fontWeight: 'bold',
    color: '#5d5d5d',
  },
  textStyle: {
    fontWeight: 'bold',
    color: '#FE5000',
  },
  secundaryTextStyle: {
    fontWeight: 'bold',
    color: '#5d5d5d',
  },
});

const Notificaciones = () => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  const { conductorperfil, obtenerConductorPerfil, seleccionarNotificacion } =
    useContext(FirebaseContext);

  const conductor = firebase.auth.currentUser;
  const conductorID = conductor.uid;

  useEffect(() => {
    //OneSignal Init Code
    // OneSignal.setLogLevel(6, 0);
    // OneSignal.setAppId('163bfd76-7193-453e-a474-908374132144'); //2c125c57-4625-42eb-9b35-107bbb66c0ae

    obtenerConductorPerfil(conductorID);

    firebase.db
      .collection('conductores')
      .doc(conductorID)
      .collection('notificaciones')
      .where('verificado', '==', true)
      .onSnapshot(manejarSnapshot);
  }, []);

  function manejarSnapshot(snapshot) {
    let notificaciones = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    // console.log(notificaciones);

    // Ordena por fecha
    notificaciones = notificaciones.sort(function (a, b) {
      return new Date(b.creado) - new Date(a.creado);
    });

    setNotificaciones(notificaciones);
  }

  // Cambia status de un pedido
  const statusPedidoEntregado = (item, checked) => {
    try {
      // Si cambia el status de la orden suma o resta a ordenes pendientes del conductor
      if (checked) {
        const sumaOrdenesPendientes = conductorperfil.ordenesPendientes - 1;
        const unsubscribe0 = firebase.db
          .collection('conductores')
          .doc(conductorID)
          .update({ ordenesPendientes: sumaOrdenesPendientes });
      } else {
        const sumaOrdenesPendientes = conductorperfil.ordenesPendientes + 1;
        const unsubscribe0 = firebase.db
          .collection('conductores')
          .doc(conductorID)
          .update({ ordenesPendientes: sumaOrdenesPendientes });
      }
      const unsubscribe1 = firebase.db
        .collection('clientes')
        .doc(item.clienteId)
        .collection('ordenes')
        .doc(item.id)
        .update({ entregado: checked });

      const unsubscribe2 = firebase.db
        .collection('restaurantes')
        .doc(item.restauranteId)
        .collection('ordenes')
        .doc(item.id)
        .update({ entregado: checked });

      const unsubscribe3 = firebase.db
        .collection('conductores')
        .doc(conductorID)
        .collection('notificaciones')
        .doc(item.id)
        .update({ entregado: checked });

      return () => {
        // Unmouting
        unsubscribe0();
        unsubscribe1();
        unsubscribe2();
        unsubscribe3();
      };
    } catch (error) {
      console.log(error);
    }
  };

  // Hook para redireccionar
  const navigation = useNavigation();

  const keyExtractor = (item, index) => index.toString();

  const callPhone = (telefono) => {
    Linking.openURL(`tel:${telefono}`);
  };

  const renderNotificationItem = ({ item, index }) => (
    <View style={styles.notificationContainer}>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={item.entregado}
          onValueChange={(checked) => {
            statusPedidoEntregado(item, checked);
          }}
          style={styles.checkbox}
        />
        <Text style={styles.label}>
          Status Orden: {item.entregado ? 'Entregado' : 'No entregado'}
        </Text>
      </View>
      <View>
        <Text style={styles.secundaryTextStyle}>
          {new Date(item.creado).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </Text>
        <Text style={styles.textStyle}>Orden:</Text>
        <Text style={styles.secundaryTextStyle}>{item.id}</Text>

        <Text style={styles.textStyle}>Datos restaurante:</Text>
        <Text style={styles.secundaryTextStyle}>{item.restaurantenombre}</Text>
        <Text style={styles.secundaryTextStyle}>
          {item.restaurantedireccion}
        </Text>
        <Text style={styles.textStyle}>Datos cliente:</Text>
        <Text style={styles.secundaryTextStyle}>{item.clientenombre}</Text>
        <Text
          onPress={() => callPhone(item.clientetelefono)}
          style={[styles.secundaryTextStyle, { color: '#8c004b' }]}
        >
          {item.clientetelefono}
        </Text>
        <Text style={styles.secundaryTextStyle}>{item.clientedireccion}</Text>
        <Text style={styles.textStyle}>Productos:</Text>
        {item.orden.map((orden) => (
          <Text style={styles.secundaryTextStyle} key={orden.id}>
            {orden.nombre}{' '}
          </Text>
        ))}

        {item.cantidadefectivo && (
          <>
            <Text style={styles.textStyle}>Pago efectivo:</Text>
            <Text style={styles.secundaryTextStyle}>$ {item.pagototal}</Text>
          </>
        )}
      </View>
      <Text
        style={[styles.textStyle, { color: '#8c004b' }]}
        onPress={() => {
          seleccionarNotificacion(item);
          navigation.navigate('MapaConductor');
        }}
      >
        RUTA
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={keyExtractor} //keyExtractor={(notificaciones) => notificaciones.id}
        data={notificaciones}
        renderItem={renderNotificationItem}
      />
    </View>
  );
};

export default Notificaciones;
