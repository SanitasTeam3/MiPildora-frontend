// Utilidades para formateo de fechas y horas
export const dateUtils = {
  // Formatear fecha en español
  formatDate: (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };
    
    return new Date(date).toLocaleDateString('es-ES', defaultOptions);
  },

  // Formatear hora en formato 24h
  formatTime: (date, includeSeconds = false) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds && { second: '2-digit' }),
    };
    
    return new Date(date).toLocaleTimeString('es-ES', options);
  },

  // Formatear fecha y hora juntas
  formatDateTime: (date) => {
    return `${dateUtils.formatDate(date)} a las ${dateUtils.formatTime(date)}`;
  },

  // Obtener fecha relativa (ej: "hace 2 horas", "en 30 minutos")
  getRelativeTime: (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMs = targetDate.getTime() - now.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (Math.abs(diffInMinutes) < 1) {
      return 'ahora';
    } else if (Math.abs(diffInMinutes) < 60) {
      return diffInMinutes > 0 
        ? `en ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`
        : `hace ${Math.abs(diffInMinutes)} minuto${Math.abs(diffInMinutes) !== 1 ? 's' : ''}`;
    } else if (Math.abs(diffInHours) < 24) {
      return diffInHours > 0
        ? `en ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`
        : `hace ${Math.abs(diffInHours)} hora${Math.abs(diffInHours) !== 1 ? 's' : ''}`;
    } else {
      return diffInDays > 0
        ? `en ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`
        : `hace ${Math.abs(diffInDays)} día${Math.abs(diffInDays) !== 1 ? 's' : ''}`;
    }
  },

  // Verificar si una fecha es hoy
  isToday: (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    return today.toDateString() === targetDate.toDateString();
  },

  // Verificar si una fecha es mañana
  isTomorrow: (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const targetDate = new Date(date);
    return tomorrow.toDateString() === targetDate.toDateString();
  },

  // Obtener el inicio del día
  getStartOfDay: (date = new Date()) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  },

  // Obtener el fin del día
  getEndOfDay: (date = new Date()) => {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  },
};

// Utilidades para validaciones
export const validationUtils = {
  // Validar email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validar formato de hora (HH:MM)
  isValidTime: (time) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  },

  // Validar que una fecha no sea en el pasado
  isNotPastDate: (date) => {
    const today = dateUtils.getStartOfDay();
    const targetDate = dateUtils.getStartOfDay(date);
    return targetDate >= today;
  },

  // Validar que una fecha de fin sea posterior a la de inicio
  isEndDateAfterStartDate: (startDate, endDate) => {
    return new Date(endDate) > new Date(startDate);
  },

  // Validar longitud de texto
  isValidLength: (text, min = 0, max = Infinity) => {
    const length = text ? text.length : 0;
    return length >= min && length <= max;
  },

  // Validar que un valor no esté vacío
  isNotEmpty: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },
};

// Utilidades para formateo de texto
export const textUtils = {
  // Capitalizar primera letra
  capitalize: (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // Convertir a título (primera letra de cada palabra en mayúscula)
  toTitleCase: (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(word => textUtils.capitalize(word))
      .join(' ');
  },

  // Truncar texto con puntos suspensivos
  truncate: (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  // Pluralizar palabras simples
  pluralize: (word, count) => {
    if (count === 1) return word;
    
    // Reglas básicas de pluralización en español
    if (word.endsWith('z')) {
      return word.slice(0, -1) + 'ces';
    } else if (word.endsWith('s') || word.endsWith('x')) {
      return word;
    } else if (word.endsWith('í') || word.endsWith('ú')) {
      return word + 'es';
    } else if (word.match(/[aeiou]$/)) {
      return word + 's';
    } else {
      return word + 'es';
    }
  },

  // Generar iniciales
  getInitials: (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  },
};

// Utilidades para colores y estilos
export const styleUtils = {
  // Obtener color según severidad
  getSeverityColor: (severity) => {
    const colors = {
      mild: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      moderate: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      severe: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    };
    return colors[severity] || colors.mild;
  },

  // Obtener color según estado de medicación
  getMedicationStatusColor: (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      taken: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      skipped: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    };
    return colors[status] || colors.pending;
  },

  // Generar color de avatar basado en texto
  getAvatarColor: (text) => {
    if (!text) return 'bg-gray-500';
    
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
    ];
    
    const hash = text
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return colors[hash % colors.length];
  },
};

// Utilidades para localStorage
export const storageUtils = {
  // Guardar en localStorage con manejo de errores
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  // Obtener de localStorage con manejo de errores
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  // Eliminar de localStorage
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  // Limpiar localStorage
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

// Utilidades para arrays
export const arrayUtils = {
  // Agrupar array por una propiedad
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Ordenar array por una propiedad
  sortBy: (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (direction === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  },

  // Filtrar duplicados por una propiedad
  uniqueBy: (array, key) => {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  },

  // Buscar en array por múltiples propiedades
  search: (array, searchTerm, searchKeys) => {
    if (!searchTerm) return array;
    
    const term = searchTerm.toLowerCase();
    return array.filter(item =>
      searchKeys.some(key => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        if (Array.isArray(value)) {
          return value.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(term)
          );
        }
        return false;
      })
    );
  },
};

// Utilidades para números
export const numberUtils = {
  // Formatear porcentaje
  formatPercentage: (value, decimals = 0) => {
    return `${value.toFixed(decimals)}%`;
  },

  // Redondear a decimales específicos
  round: (value, decimals = 2) => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  // Generar número aleatorio entre min y max
  random: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Verificar si un valor es un número válido
  isValidNumber: (value) => {
    return !isNaN(value) && isFinite(value);
  },
};
