import { createContext, useContext, useReducer, useEffect } from 'react';
import { userService, notificationService, handleApiError } from '../services/medicationService';

// Estado inicial de la aplicación
const initialState = {
  user: null,
  notifications: [],
  preferences: {
    darkMode: false,
    language: 'es',
    notificationsEnabled: true,
    soundEnabled: true,
  },
  ui: {
    sidebarOpen: false,
    currentView: 'dashboard',
    loading: false,
    error: null,
  },
  stats: {
    totalMedications: 0,
    todayTaken: 0,
    todayPending: 0,
    adherenceRate: 0,
  },
};

// Tipos de acciones
const actionTypes = {
  SET_USER: 'SET_USER',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  SET_CURRENT_VIEW: 'SET_CURRENT_VIEW',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_STATS: 'UPDATE_STATS',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer para manejar el estado
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case actionTypes.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };

    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case actionTypes.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };

    case actionTypes.SET_SIDEBAR_OPEN:
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: action.payload,
        },
      };

    case actionTypes.SET_CURRENT_VIEW:
      return {
        ...state,
        ui: {
          ...state.ui,
          currentView: action.payload,
        },
      };

    case actionTypes.SET_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: action.payload,
        },
      };

    case actionTypes.SET_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload,
        },
      };

    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: null,
        },
      };

    case actionTypes.UPDATE_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

// Crear contexto
const AppContext = createContext();

// Provider del contexto
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Cargar datos iniciales
  useEffect(() => {
    const initializeApp = async () => {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      try {
        // Cargar preferencias desde localStorage
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          const preferences = JSON.parse(savedPreferences);
          dispatch({ type: actionTypes.UPDATE_PREFERENCES, payload: preferences });
          
          // Aplicar modo oscuro
          if (preferences.darkMode) {
            document.documentElement.classList.add('dark');
          }
        }

        // Preparado para cargar datos del backend cuando esté disponible
        console.log('App initialized - ready for backend integration');

      } catch (error) {
        const errorInfo = handleApiError(error);
        dispatch({ type: actionTypes.SET_ERROR, payload: errorInfo });
      } finally {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    };

    initializeApp();
  }, []);

  // Acciones del contexto
  const actions = {
    // Usuario
    setUser: (user) => {
      dispatch({ type: actionTypes.SET_USER, payload: user });
    },

    updateUserProfile: async (profileData) => {
      try {
        const updatedUser = await userService.updateUserProfile(profileData);
        dispatch({ type: actionTypes.SET_USER, payload: updatedUser });
        return updatedUser;
      } catch (error) {
        const errorInfo = handleApiError(error);
        dispatch({ type: actionTypes.SET_ERROR, payload: errorInfo });
        throw error;
      }
    },

    // Preferencias
    updatePreferences: async (preferences) => {
      const newPreferences = { ...state.preferences, ...preferences };
      
      // Guardar en localStorage
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      
      // Actualizar estado
      dispatch({ type: actionTypes.UPDATE_PREFERENCES, payload: preferences });

      // Aplicar modo oscuro
      if (preferences.darkMode !== undefined) {
        if (preferences.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      // Sincronizar con el servidor si el usuario está autenticado
      if (state.user) {
        try {
          await userService.updateUserPreferences(newPreferences);
        } catch (error) {
          console.error('Error syncing preferences:', error);
        }
      }
    },

    // Notificaciones
    addNotification: (notification) => {
      const newNotification = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...notification,
      };
      dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: newNotification });
    },

    removeNotification: async (notificationId) => {
      dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: notificationId });
      
      try {
        await notificationService.markNotificationAsRead(notificationId);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },

    // UI
    setSidebarOpen: (isOpen) => {
      dispatch({ type: actionTypes.SET_SIDEBAR_OPEN, payload: isOpen });
    },

    setCurrentView: (view) => {
      dispatch({ type: actionTypes.SET_CURRENT_VIEW, payload: view });
    },

    setLoading: (loading) => {
      dispatch({ type: actionTypes.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: actionTypes.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: actionTypes.CLEAR_ERROR });
    },

    // Estadísticas
    updateStats: (stats) => {
      dispatch({ type: actionTypes.UPDATE_STATS, payload: stats });
    },

    // Función para mostrar toast/notificación temporal
    showToast: (message, type = 'info', duration = 3000) => {
      const toast = {
        id: Date.now().toString(),
        message,
        type,
        timestamp: new Date(),
        autoRemove: true,
      };

      dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: toast });

      // Auto-remover después del tiempo especificado
      setTimeout(() => {
        dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: toast.id });
      }, duration);
    },
  };

  const value = {
    state,
    actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar el contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};

// Hook para acceder solo al estado
export const useAppState = () => {
  const { state } = useAppContext();
  return state;
};

// Hook para acceder solo a las acciones
export const useAppActions = () => {
  const { actions } = useAppContext();
  return actions;
};
