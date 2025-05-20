import {
  OBTENER_CONDUCTOR,
  OBTENER_CONDUCTOR_PERFIL,
  SELECCIONAR_NOTIFICACION,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case OBTENER_CONDUCTOR:
      return {
        ...state,
        conductorinfo: action.payload,
      };

    case OBTENER_CONDUCTOR_PERFIL:
      return {
        ...state,
        conductorperfil: action.payload,
      };

    case SELECCIONAR_NOTIFICACION:
      return {
        ...state,
        notificacion: action.payload,
      };

    default:
      return state;
  }
};
