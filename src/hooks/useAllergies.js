import { useState, useEffect, useCallback } from 'react';
import { allergyService, handleApiError } from '../services/medicationService';

// Hook para gestionar alergias
export const useAllergies = () => {
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todas las alergias
  const loadAllergies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await allergyService.getAllAllergies();
      setAllergies(data.allergies || data || []);
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo);
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar nueva alergia
  const addAllergy = useCallback(async (allergyData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newAllergy = await allergyService.createAllergy(allergyData);
      setAllergies(prev => [...prev, newAllergy]);
      return newAllergy;
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar alergia
  const updateAllergy = useCallback(async (id, allergyData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedAllergy = await allergyService.updateAllergy(id, allergyData);
      setAllergies(prev => 
        prev.map(allergy => allergy.id === id ? updatedAllergy : allergy)
      );
      return updatedAllergy;
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar alergia
  const deleteAllergy = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await allergyService.deleteAllergy(id);
      setAllergies(prev => prev.filter(allergy => allergy.id !== id));
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar interacciones con medicamentos
  const checkMedicationAllergies = useCallback(async (medicationName) => {
    setError(null);
    
    try {
      const result = await allergyService.checkMedicationAllergies(medicationName, allergies);
      return result;
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo);
      throw err;
    }
  }, [allergies]);

  // Cargar alergias al montar el componente
  useEffect(() => {
    loadAllergies();
  }, [loadAllergies]);

  // Funciones de utilidad
  const getAllergyById = useCallback((id) => {
    return allergies.find(allergy => allergy.id === id);
  }, [allergies]);

  const getAllergiesBySeverity = useCallback((severity) => {
    return allergies.filter(allergy => allergy.severity === severity);
  }, [allergies]);

  const getSevereAllergies = useCallback(() => {
    return getAllergiesBySeverity('severe');
  }, [getAllergiesBySeverity]);

  const searchAllergies = useCallback((searchTerm) => {
    if (!searchTerm) return allergies;
    
    const term = searchTerm.toLowerCase();
    return allergies.filter(allergy => 
      allergy.name.toLowerCase().includes(term) ||
      allergy.description.toLowerCase().includes(term) ||
      allergy.symptoms.some(symptom => symptom.toLowerCase().includes(term))
    );
  }, [allergies]);

  return {
    allergies,
    loading,
    error,
    loadAllergies,
    addAllergy,
    updateAllergy,
    deleteAllergy,
    checkMedicationAllergies,
    getAllergyById,
    getAllergiesBySeverity,
    getSevereAllergies,
    searchAllergies,
  };
};

// Hook para verificación de alergias en tiempo real
export const useAllergyChecker = () => {
  const [checking, setChecking] = useState(false);
  const [warnings, setWarnings] = useState([]);

  const checkAllergies = useCallback(async (medicationName, allergies) => {
    if (!medicationName || !allergies.length) {
      setWarnings([]);
      return [];
    }

    setChecking(true);
    
    try {
      // Verificación local simple (en producción sería más sofisticada)
      const localWarnings = allergies.filter(allergy => 
        medicationName.toLowerCase().includes(allergy.name.toLowerCase()) ||
        allergy.name.toLowerCase().includes(medicationName.toLowerCase())
      );

      setWarnings(localWarnings);
      return localWarnings;
    } catch (err) {
      console.error('Error checking allergies:', err);
      return [];
    } finally {
      setChecking(false);
    }
  }, []);

  const clearWarnings = useCallback(() => {
    setWarnings([]);
  }, []);

  return {
    checking,
    warnings,
    checkAllergies,
    clearWarnings,
  };
};
