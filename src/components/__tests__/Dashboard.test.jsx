import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';

// Mock hooks used by Dashboard
jest.mock('../../hooks/useMedications', () => ({
  useMedications: () => ({
    medications: [
      { id: '1', name: 'Ibuprofeno', dosage: '200mg', times: [{ time: '09:00' }], frequency: 'Diario', status: 'active' }
    ],
    loading: false,
    error: null,
    loadMedications: jest.fn()
  })
}));

jest.mock('../../hooks/useAppContext', () => ({
  useAppContext: () => ({ state: {}, actions: {} })
}));

describe('Dashboard', () => {
  test('muestra estadísticas básicas cuando hay medicamentos', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Medicamentos Activos/i)).toBeInTheDocument();
      expect(screen.getByText(/Dosis de Hoy/i)).toBeInTheDocument();
      expect(screen.getByText(/Adherencia/i)).toBeInTheDocument();
    });

    // Buscar el texto que indica el total: "1 total"
    expect(screen.getByText(/1\s*total/i)).toBeInTheDocument();
    expect(screen.getByText(/Ibuprofeno/i)).toBeInTheDocument();
  });
});
