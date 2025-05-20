/**
 * Ubix conductor
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler'; // En nuevas versiones va de primer lugar
import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { YellowBox, TabBarIOS } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Splash from './src/screens/Splash';
import SignIn from './src/screens/SignIn';
import MapaConductor from './src/screens/MapaConductor';
import Notificaciones from './src/screens/Notificaciones';
import Perfil from './src/screens/Perfil';

import firebase from './firebase';
import FirebaseState from './context/firebase/firebaseState';

YellowBox.ignoreWarnings([
  //'Setting a timer',
]);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSinged, setIsSinged] = useState(false);

  useEffect(() => {
    let unmounted = false;

    let timer = setTimeout(() => {
      if (!unmounted) {
        setIsLoading(false);
      }
    }, 3000);
    try {
      firebase.auth.onAuthStateChanged((user) => {
        user ? setIsSinged(true) : setIsSinged(false);
      });
    } catch (error) {
      console.log('error mamerto:', error);
    }

    // return function cleanup() {
    //   unmounted = true;
    //   clearTimeout(timer);
    // };
    return () => {
      unmounted = true;
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <Splash />;
  }

  return (
    <>
      <FirebaseState>
        <NavigationContainer>
          <Stack.Navigator>
            {isSinged ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeWithBottomTabs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="MapaConductor"
                  component={MapaConductor}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{
                  title: 'Iniciar sesión',
                  headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                  },
                }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </FirebaseState>
    </>
  );
};

const HomeWithBottomTabs = () => (
  <Tab.Navigator tabBarOptions={{ activeTintColor: '#ff4800' }}>
    <Tab.Screen
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="map-o" size={25} color={color} />
        ),
      }}
      name="Mapa Conductor"
      component={MapaConductor}
    />

    <Tab.Screen
      options={{
        tabBarIcon: ({ color }) => <Icon name="fire" size={25} color={color} />,
      }}
      name="Notificaciones"
      component={Notificaciones}
    />

    <Tab.Screen
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="motorcycle" size={25} color={color} />
        ),
      }}
      name="Perfil"
      component={Perfil}
    />
  </Tab.Navigator>
);

export default App;
