// Tipos para la aplicación de medicación Sanitas

/**
 * @typedef {Object} Medication
 * @property {string} id - ID único del medicamento
 * @property {string} name - Nombre del medicamento
 * @property {string} dosage - Dosis del medicamento
 * @property {string} frequency - Frecuencia de toma
 * @property {string[]} times - Horarios de toma
 * @property {Date} startDate - Fecha de inicio
 * @property {Date} endDate - Fecha de fin
 * @property {string} notes - Notas adicionales
 * @property {boolean} isActive - Si el medicamento está activo
 * @property {MedicationTake[]} takes - Registro de tomas
 */

/**
 * @typedef {Object} MedicationTake
 * @property {string} id - ID único de la toma
 * @property {string} medicationId - ID del medicamento
 * @property {Date} scheduledTime - Hora programada
 * @property {Date|null} takenTime - Hora real de toma
 * @property {boolean} isTaken - Si fue tomado
 * @property {string} status - Estado: 'pending', 'taken', 'overdue', 'skipped'
 */

/**
 * @typedef {Object} Allergy
 * @property {string} id - ID único de la alergia
 * @property {string} name - Nombre del alérgeno
 * @property {string} severity - Severidad: 'mild', 'moderate', 'severe'
 * @property {string} description - Descripción de la alergia
 * @property {string[]} symptoms - Síntomas asociados
 */

/**
 * @typedef {Object} User
 * @property {string} id - ID único del usuario
 * @property {string} name - Nombre del usuario
 * @property {string} email - Email del usuario
 * @property {Allergy[]} allergies - Alergias del usuario
 * @property {Object} preferences - Preferencias del usuario
 * @property {boolean} preferences.darkMode - Modo oscuro activado
 * @property {boolean} preferences.notifications - Notificaciones activadas
 * @property {string} preferences.language - Idioma preferido
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Si la operación fue exitosa
 * @property {any} data - Datos de respuesta
 * @property {string} message - Mensaje de respuesta
 * @property {Object|null} error - Error si existe
 */

/**
 * @typedef {Object} MedicationFormData
 * @property {string} name - Nombre del medicamento
 * @property {string} dosage - Dosis
 * @property {string} frequency - Frecuencia
 * @property {string[]} times - Horarios
 * @property {string} startDate - Fecha de inicio
 * @property {string} endDate - Fecha de fin
 * @property {string} notes - Notas
 */

/**
 * @typedef {Object} AllergyFormData
 * @property {string} name - Nombre del alérgeno
 * @property {string} severity - Severidad
 * @property {string} description - Descripción
 * @property {string[]} symptoms - Síntomas
 */

// Estados de medicación
export const MEDICATION_STATUS = {
  PENDING: 'pending',
  TAKEN: 'taken',
  OVERDUE: 'overdue',
  SKIPPED: 'skipped'
};

// Severidad de alergias
export const ALLERGY_SEVERITY = {
  MILD: 'mild',
  MODERATE: 'moderate',
  SEVERE: 'severe'
};

// Frecuencias de medicación
export const MEDICATION_FREQUENCY = {
  ONCE_DAILY: 'once_daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  FOUR_TIMES_DAILY: 'four_times_daily',
  EVERY_8_HOURS: 'every_8_hours',
  EVERY_12_HOURS: 'every_12_hours',
  AS_NEEDED: 'as_needed',
  CUSTOM: 'custom'
};

// Endpoints de la API
export const API_ENDPOINTS = {
  MEDICATIONS: '/medicamentos',
  MEDICATION_BY_ID: (id) => `/medicamentos/${id}`,
  MARK_TAKEN: (id) => `/medicamentos/${id}/tomado`,
  ALLERGIES: '/alergias',
  ALLERGY_BY_ID: (id) => `/alergias/${id}`,
  USER_PROFILE: '/perfil'
};
