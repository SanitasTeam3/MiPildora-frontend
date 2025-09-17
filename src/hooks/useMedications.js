import { useState, useCallback } from 'react';
import { medicationService } from '../services/medicationService';

export const useMedications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los medicamentos desde el backend
  const loadMedications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await medicationService.getAll();
      setMedications(data || []);
    } catch (err) {
      console.error('Error loading medications:', err);
      setError({
        message: 'No se pudieron cargar los medicamentos. Verifica tu conexión.',
        type: 'LOAD_ERROR'
      });
      // En caso de error, mantener array vacío en lugar de datos mock
      setMedications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar nuevo medicamento
  const addMedication = useCallback(async (medicationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newMedication = await medicationService.create(medicationData);
      setMedications(prev => [...prev, newMedication]);
      return { success: true, data: newMedication };
    } catch (err) {
      console.error('Error adding medication:', err);
      const errorMessage = err.message || 'No se pudo agregar el medicamento';
      setError({
        message: errorMessage,
        type: 'ADD_ERROR'
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar medicamento existente
  const updateMedication = useCallback(async (id, medicationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedMedication = await medicationService.update(id, medicationData);
      setMedications(prev => 
        prev.map(med => med.id === id ? updatedMedication : med)
      );
      return { success: true, data: updatedMedication };
    } catch (err) {
      console.error('Error updating medication:', err);
      const errorMessage = err.message || 'No se pudo actualizar el medicamento';
      setError({
        message: errorMessage,
        type: 'UPDATE_ERROR'
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar medicamento
  const deleteMedication = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await medicationService.delete(id);
      setMedications(prev => prev.filter(med => med.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting medication:', err);
      const errorMessage = err.message || 'No se pudo eliminar el medicamento';
      setError({
        message: errorMessage,
        type: 'DELETE_ERROR'
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Marcar medicamento como tomado
  const markAsTaken = useCallback(async (id, takenAt = new Date()) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await medicationService.markAsTaken(id, takenAt);
      // Actualizar el medicamento en el estado local
      setMedications(prev => 
        prev.map(med => 
          med.id === id 
            ? { ...med, lastTaken: takenAt, status: 'taken' }
            : med
        )
      );
      return { success: true, data: result };
    } catch (err) {
      console.error('Error marking medication as taken:', err);
      const errorMessage = err.message || 'No se pudo marcar como tomado';
      setError({
        message: errorMessage,
        type: 'MARK_TAKEN_ERROR'
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Funciones de utilidad para filtrar medicamentos
  const getActiveMedications = useCallback(() => {
    return medications.filter(med => med.status === 'active');
  }, [medications]);

  const getMedicationById = useCallback((id) => {
    return medications.find(med => med.id === id);
  }, [medications]);

  const getTodaysMedications = useCallback(() => {
    const today = new Date().toDateString();
    return medications.filter(med => {
      // Filtrar medicamentos que tienen dosis programadas para hoy
      return med.times && med.times.length > 0 && med.status === 'active';
    });
  }, [medications]);

  const getUpcomingMedications = useCallback(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return medications
      .filter(med => med.status === 'active' && med.times)
      .flatMap(med => 
        med.times.map(time => ({
          ...med,
          scheduledTime: time.time,
          timeInMinutes: parseInt(time.time.split(':')[0]) * 60 + parseInt(time.time.split(':')[1])
        }))
      )
      .filter(med => med.timeInMinutes > currentTime)
      .sort((a, b) => a.timeInMinutes - b.timeInMinutes)
      .slice(0, 5); // Próximos 5 medicamentos
  }, [medications]);

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    medications,
    loading,
    error,
    
    // Acciones CRUD
    loadMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    markAsTaken,
    
    // Funciones de utilidad
    getActiveMedications,
    getMedicationById,
    getTodaysMedications,
    getUpcomingMedications,
    
    // Utilidades
    clearError
  };
};
