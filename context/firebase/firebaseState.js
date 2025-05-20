import React, { useReducer } from 'react';

import firebase from '../../firebase'; // index
import FirebaseReducer from './firebaseReducer';
import FirebaseContext from './firebaseContext';

import {
  OBTENER_CONDUCTOR,
  OBTENER_CONDUCTOR_PERFIL,
  SELECCIONAR_NOTIFICACION,
} from '../../types';

const FirebaseState = (props) => {
  const initialState = {
    conductorinfo: [],
    conductorperfil: [],
    notificacion: null,
  };

  // useReducer con dispatch para ejecutar las funciones
  const [state, dispatch] = useReducer(FirebaseReducer, initialState);

  const obtenerConductorInfo = async () => {
    const conductor = await firebase.auth.currentUser;
    const conductorInfo = conductor.providerData[0];
    // const conductorID = conductor.uid;

    dispatch({
      type: OBTENER_CONDUCTOR,
      payload: conductorInfo,
    });
    console.log(conductorInfo);
    // console.log(conductorID);
  };

  const obtenerConductorPerfil = (conductorid) => {
    // console.log(conductorid);
    firebase.db
      .collection('conductores')
      .doc(conductorid)
      .onSnapshot(function (doc) {
        const conductorPerfil = {
          id: doc.id,
          ...doc.data(),
        };

        dispatch({
          type: OBTENER_CONDUCTOR_PERFIL,
          payload: conductorPerfil,
        });
      });
  };

  const seleccionarNotificacion = (notificacion) => {
    // console.log(notificacion);
    dispatch({
      type: SELECCIONAR_NOTIFICACION,
      payload: notificacion,
    });
  };

  return (
    <FirebaseContext.Provider
      value={{
        conductorinfo: state.conductorinfo,
        conductorperfil: state.conductorperfil,
        notificacion: state.notificacion,
        obtenerConductorInfo,
        obtenerConductorPerfil,
        seleccionarNotificacion,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseState;
