/**
 * Ubix conductor
 *
 * @format
 * @flow
 */

import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Button,
  SafeAreaView,
  StatusBar,
  Switch,
  Dimensions,
  ActivityIndicator,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polygon,
  AnimatedRegion,
} from 'react-native-maps';
import { request, PERMISSIONS } from 'react-native-permissions'; // Permiso para usar la geolocalizacion de los usuarios
import Geolocation from 'react-native-geolocation-service'; // Para localizar los usuarios. Antes: @react-native-community/geolocation
import MapViewDirections from 'react-native-maps-directions'; // Para trazar rutas, distancia y tiempo entre origen y destino
import Geocoder from 'react-native-geocoding'; // Transforma las coordenadas en direccion

import {
  GeoCollectionReference,
  GeoFirestore,
  GeoQuery,
  GeoQuerySnapshot,
} from 'geofirestore';

import firebase from '../../firebase';
import messaging from '@react-native-firebase/messaging';
import FirebaseContext from '../../context/firebase/firebaseContext';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Se tiene que inicializar
Geocoder.init(Config.FIREBASE_API_KEY);

const MapaConductor = () => {
  const { conductorperfil, obtenerConductorPerfil, notificacion } =
    useContext(FirebaseContext);

  const [direccionCliente, setDireccionCliente] = useState({
    lat: 0,
    lng: 0,
  });
  const [direccionRestaurante, setDireccionRestaurante] = useState({
    lat: 0,
    lng: 0,
  });

  const [posicionInicial, setPosicionInicial] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.009,
    longitudeDelta: 0.035,
  });

  const [nuevaPosicion, setNuevaPosicion] = useState(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.009,
      longitudeDelta: 0.035,
    }),
  );

  const [disparador, setDisparador] = useState(false);

  // const firestore = firebase.db;
  const conductor = firebase.auth.currentUser;
  const conductorID = conductor.uid;
  const geofirestore = new GeoFirestore(firebase.db);
  const geocollection = geofirestore.collection('conductores');
  const geodocument = geocollection.doc(conductorID);

  // Hook para redireccionar
  const navigation = useNavigation();

  // Firebase Cloud Messaging
  useEffect(() => {
    async function mensajeRecibido(mensaje) {
      const { timestamp } = mensaje.data;
      // const { title, body } = mensaje.notification;
      // const options = { weekday: 'long', month: 'long', day: 'numeric' };

      Alert.alert(
        'Orden entrante!',
        `${new Date(Number(timestamp)).toLocaleTimeString()}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Notificaciones'),
          },
        ],
        { cancelable: false },
      );

      // console.log('Background Push notification reciba!', mensaje);
    }

    async function navigateToNotificationScreen() {
      navigation.navigate('Notificaciones');
    }

    // console.log(conductorID);
    const topicSubscribe = firebase.messaging.subscribeToTopic(conductorID);
    // .then(() => console.log('TopicSubscriber'));

    const foregroundSubscribe = firebase.messaging.onMessage(
      async (remoteMessage) => {
        mensajeRecibido(remoteMessage);
      },
    );

    const backgroundSubscribe = firebase.messaging.setBackgroundMessageHandler(
      async (remoteMessage) => {
        mensajeRecibido(remoteMessage);
      },
    );

    const notificationOpenAppFromBackground =
      firebase.messaging.onNotificationOpenedApp((remoteMessage) => {
        navigateToNotificationScreen();
      });

    const notificationOpenAppFromClosed = firebase.messaging
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          navigateToNotificationScreen();
        }
      });

    return () => {
      firebase.messaging.unsubscribeFromTopic(conductorID);
      // topicSubscribe();
      foregroundSubscribe();
      // backgroundSubscribe();
      notificationOpenAppFromBackground();
      // notificationOpenAppFromClosed();
    };
  }, []);

  useEffect(() => {
    function obtenerLocalizacion() {
      solicitarPermisoLocalizacion();
    }
    obtenerConductorPerfil(conductorID);
    obtenerLocalizacion();
  }, []);

  // El punto 1 inicia en (10,-66) y el centro de observacion es (10.3740400283, -66.957115531).
  // En ese momento solo se detecta en el radio al punto 2(10.374, -66.95) y punto 3(10.374374, -66.9595).
  // Al actualizar la localizacion del punto 1, tambien se detecta en el radio.
  useEffect(() => {
    function guardarLocalizacionActual() {
      geodocument.update({
        // El campo de coordenadas debe ser un GeoPoint
        coordinates: new firebase.fire.GeoPoint(latitude, longitude),
      });

      console.log('latitude gruero:', latitude, 'longitude gruero:', longitude);
    }

    const { latitude, longitude } = posicionInicial;
    try {
      if (latitude && longitude) {
        guardarLocalizacionActual();
      }
    } catch (error) {
      console.log(error);
    }

    // return function cleanup() {
    //
    // };
  }, [posicionInicial.longitude, posicionInicial.latitude]);

  const solicitarPermisoLocalizacion = async () => {
    if (Platform.OS == 'ios') {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      // console.log('iPhone' + response);

      if (response === 'granted') {
        localizarPosicionInicial();
        localizarPosicionActual();
      }
    } else {
      var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      // console.log('Android' + response);

      if (response === 'granted') {
        localizarPosicionInicial();
        localizarPosicionActual();
      }
    }
  };

  const localizarPosicionInicial = async () => {
    await Geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        let posicionInicial = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.035,
        };

        // Pregunta si ya existen notificaciones
        if (notificacion) {
          // Convirtiendo la direccion del cliente en coordenadas
          const localidadcliente = await Geocoder.from(
            notificacion.clientedireccion,
          );
          const localidadCliente =
            localidadcliente.results[0].geometry.location;

          // Convirtiendo la direccion del restaurante en coordenadas
          const localidadrestaurante = await Geocoder.from(
            notificacion.restaurantedireccion,
          );
          const localidadRestaurante =
            localidadrestaurante.results[0].geometry.location;

          setDireccionCliente(localidadCliente);
          setDireccionRestaurante(localidadRestaurante);
        }
        setPosicionInicial(posicionInicial);
      }, //success

      (error) => console.log(error), //error

      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }, //options
    );
  };

  // 10.3740400283,-66.957115531
  const localizarPosicionActual = async () => {
    await Geolocation.watchPosition(
      ({ coords: { latitude, longitude } }) => {
        let nuevaPosicion = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.035,
        };
        setPosicionInicial(nuevaPosicion);
        setNuevaPosicion(nuevaPosicion);
      }, //success

      (error) => console.log(error), //error

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
        distanceFilter: 10,
      }, //options
    );
  };

  // Cambia status de disponible
  const statusDisponible = (value) => {
    try {
      const unsubscribe = firebase.db
        .collection('conductores')
        .doc(conductorID)
        .update({ disponible: value });

      return () => {
        // Unmouting

        unsubscribe();
      };
    } catch (error) {
      console.log(error);
    }
  };

  const callPhone = (telefono) => {
    Linking.openURL(`tel:${telefono}`);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        {posicionInicial.latitude === 0 ? (
          <View style={styles.activityIndicator}>
            <ActivityIndicator animating color={'#FE5000'} size="large" />
          </View>
        ) : (
          <>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              ref={(map) => (map = map)}
              showsUserLocation={true}
              followUserLocation
              showsMyLocationButton={true}
              region={posicionInicial}
              loadingEnabled
            >
              <Marker.Animated
                coordinate={nuevaPosicion}
                pinColor="green"
                icon={{
                  uri: 'https://img.icons8.com/fluent/96/000000/delivery-scooter.png',
                }}
              >
                <Callout>
                  <Text>Usted </Text>
                </Callout>
              </Marker.Animated>
              {direccionRestaurante.lat !== 0 && (
                <>
                  <Marker
                    coordinate={{
                      latitude: direccionRestaurante.lat,
                      longitude: direccionRestaurante.lng,
                      latitudeDelta: 0.009,
                      longitudeDelta: 0.035,
                    }}
                    pinColor="red"
                    icon={{
                      uri: 'https://img.icons8.com/flat-round/80/000000/home--v1.png',
                    }}
                    // title={`Restaurante: ${notificacion.restaurantedireccion}`}
                  >
                    <Callout>
                      <Text>{notificacion.restaurantedireccion}</Text>
                    </Callout>
                  </Marker>

                  <MapViewDirections
                    origin={{
                      latitude: direccionRestaurante.lat,
                      longitude: direccionRestaurante.lng,
                    }}
                    destination={notificacion.clientedireccion}
                    apikey={Config.FIREBASE_API_KEY}
                    strokeWidth={3}
                    strokeColor="#FE5000"
                    onReady={(result) => {
                      // console.log(`Distancia: ${result.distance} km`);
                      // console.log(`Tiempo de entrega: ${Math.floor(result.duration)} min.`);
                      //   guardarTiempoEntrega(Math.floor(result.duration));
                    }}
                  />

                  <Marker
                    coordinate={{
                      latitude: direccionCliente.lat,
                      longitude: direccionCliente.lng,
                      latitudeDelta: 0.009,
                      longitudeDelta: 0.035,
                    }}
                    pinColor="red"
                    icon={{
                      uri: 'https://img.icons8.com/cute-clipart/96/000000/user-male-circle.png',
                    }}
                    // title={`Cliente: ${notificacion.clientedireccion}`}
                  >
                    <Callout>
                      <Text>{notificacion.clientedireccion}</Text>
                    </Callout>
                  </Marker>
                </>
              )}
            </MapView>

            <View style={styles.botonDisponible}>
              <Switch
                value={conductorperfil.disponible}
                onValueChange={(value) => {
                  statusDisponible(value);
                }}
                trackColor={{ true: '#FE5000' }}
                thumbColor="white"
              />
            </View>
            {direccionRestaurante.lat !== 0 && (
              <View style={styles.clientContainer}>
                <View style={styles.datosCliente}>
                  <Text style={styles.textStyle}>Cliente</Text>
                  <Text style={styles.secundaryTextStyle}>
                    {notificacion.clientenombre}
                  </Text>
                  <Text
                    style={[styles.secundaryTextStyle, { color: '#8c004b' }]}
                    onPress={() => callPhone(notificacion.clientetelefono)}
                  >
                    {notificacion.clientetelefono}
                  </Text>
                  <Text style={styles.secundaryTextStyle}>
                    {notificacion.clientedireccion}
                  </Text>
                  <Text style={styles.textStyle}>Restaurante</Text>
                  <Text style={styles.secundaryTextStyle}>
                    {notificacion.restaurantenombre}
                  </Text>
                  <Text style={styles.secundaryTextStyle}>
                    {notificacion.restaurantedireccion}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  clientContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 10,
  },
  botonDisponible: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 100,
    marginTop: 11,
    borderRadius: 20,
    padding: 6,
  },
  datosCliente: {
    paddingHorizontal: 15,
  },
  textStyle: {
    fontWeight: 'bold',
    color: '#FE5000',
  },
  secundaryTextStyle: {
    fontWeight: 'bold',
    color: '#5d5d5d',
  },
  activityIndicator: {
    flex: 1,
    paddingTop: 310,
  },
});

export default MapaConductor;
