import { API_ENDPOINTS } from '../types';

// Configuración base de la API
//const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001/api';

// Configuración por defecto para las peticiones
const defaultConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Función auxiliar para manejar respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
};

// Función auxiliar para hacer peticiones HTTP
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...defaultConfig,
    ...options,
    headers: {
      ...defaultConfig.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Servicio de medicamentos
export const medicationService = {
  // Obtener todos los medicamentos
  async getAllMedications() {
    return apiRequest(API_ENDPOINTS.MEDICATIONS);
  },

  // Obtener un medicamento por ID
  async getMedicationById(id) {
    return apiRequest(API_ENDPOINTS.MEDICATION_BY_ID(id));
  },

  // Crear un nuevo medicamento
  async createMedication(medicationData) {
    return apiRequest(API_ENDPOINTS.MEDICATIONS, {
      method: 'POST',
      body: JSON.stringify(medicationData),
    });
  },

  // Actualizar un medicamento existente
  async updateMedication(id, medicationData) {
    return apiRequest(API_ENDPOINTS.MEDICATION_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(medicationData),
    });
  },

  // Eliminar un medicamento
  async deleteMedication(id) {
    return apiRequest(API_ENDPOINTS.MEDICATION_BY_ID(id), {
      method: 'DELETE',
    });
  },

  // Marcar medicamento como tomado
  async markAsTaken(id, takenData = {}) {
    const payload = {
      takenTime: new Date().toISOString(),
      ...takenData,
    };
    
    return apiRequest(API_ENDPOINTS.MARK_TAKEN(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Obtener horarios de medicamentos para un día específico
  async getMedicationSchedule(date = new Date()) {
    const dateStr = date.toISOString().split('T')[0];
    return apiRequest(`${API_ENDPOINTS.MEDICATIONS}/schedule?date=${dateStr}`);
  },

  // Obtener estadísticas de adherencia
  async getAdherenceStats(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    
    return apiRequest(`${API_ENDPOINTS.MEDICATIONS}/stats?${params.toString()}`);
  },
};

// Servicio de alergias
export const allergyService = {
  // Obtener todas las alergias
  async getAllAllergies() {
    return apiRequest(API_ENDPOINTS.ALLERGIES);
  },

  // Obtener una alergia por ID
  async getAllergyById(id) {
    return apiRequest(API_ENDPOINTS.ALLERGY_BY_ID(id));
  },

  // Crear una nueva alergia
  async createAllergy(allergyData) {
    return apiRequest(API_ENDPOINTS.ALLERGIES, {
      method: 'POST',
      body: JSON.stringify(allergyData),
    });
  },

  // Actualizar una alergia existente
  async updateAllergy(id, allergyData) {
    return apiRequest(API_ENDPOINTS.ALLERGY_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(allergyData),
    });
  },

  // Eliminar una alergia
  async deleteAllergy(id) {
    return apiRequest(API_ENDPOINTS.ALLERGY_BY_ID(id), {
      method: 'DELETE',
    });
  },

  // Verificar interacciones entre medicamento y alergias
  async checkMedicationAllergies(medicationName, allergies) {
    return apiRequest(`${API_ENDPOINTS.ALLERGIES}/check`, {
      method: 'POST',
      body: JSON.stringify({
        medicationName,
        allergies,
      }),
    });
  },
};

// Servicio de usuario/perfil
export const userService = {
  // Obtener perfil del usuario
  async getUserProfile() {
    return apiRequest(API_ENDPOINTS.USER_PROFILE);
  },

  // Actualizar perfil del usuario
  async updateUserProfile(profileData) {
    return apiRequest(API_ENDPOINTS.USER_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Actualizar preferencias del usuario
  async updateUserPreferences(preferences) {
    return apiRequest(`${API_ENDPOINTS.USER_PROFILE}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },
};

// Servicio de notificaciones
export const notificationService = {
  // Obtener notificaciones pendientes
  async getPendingNotifications() {
    return apiRequest('/notificaciones/pendientes');
  },

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId) {
    return apiRequest(`/notificaciones/${notificationId}/leida`, {
      method: 'PUT',
    });
  },

  // Configurar preferencias de notificaciones
  async updateNotificationSettings(settings) {
    return apiRequest('/notificaciones/configuracion', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

// Función para manejar errores de red de forma global
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Aquí se pueden implementar diferentes estrategias según el tipo de error
  if (error.message.includes('Failed to fetch')) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Error de conexión. Verifica tu conexión a internet.',
    };
  }
  
  if (error.message.includes('401')) {
    return {
      type: 'AUTH_ERROR',
      message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
    };
  }
  
  if (error.message.includes('403')) {
    return {
      type: 'PERMISSION_ERROR',
      message: 'No tienes permisos para realizar esta acción.',
    };
  }
  
  if (error.message.includes('404')) {
    return {
      type: 'NOT_FOUND_ERROR',
      message: 'El recurso solicitado no fue encontrado.',
    };
  }
  
  if (error.message.includes('500')) {
    return {
      type: 'SERVER_ERROR',
      message: 'Error interno del servidor. Intenta nuevamente más tarde.',
    };
  }
  
  return {
    type: 'UNKNOWN_ERROR',
    message: error.message || 'Ha ocurrido un error inesperado.',
  };
};

// Interceptor para agregar token de autenticación (si se implementa)
export const setAuthToken = (token) => {
  if (token) {
    defaultConfig.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete defaultConfig.headers['Authorization'];
  }
};

// Función para verificar si la API está disponible
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};
