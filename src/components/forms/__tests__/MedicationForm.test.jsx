import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MedicationForm from '../MedicationForm';

describe('MedicationForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('envía datos formateados correctamente cuando se hace submit con initialData', async () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    const initialData = {
      name: 'Ibuprofeno',
      dosage: '400mg',
      frequency: 'once_daily',
      times: ['08:00'],
      startDate: '2025-09-18',
      endDate: '',
      notes: 'Tomar con comida'
    };

    render(
      <MedicationForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // El botón cambia su texto según si hay initialData
    const submitBtn = screen.getByRole('button', { name: /Actualizar Medicamento/i });
    expect(submitBtn).toBeInTheDocument();

    await userEvent.click(submitBtn);

    // Esperar que onSubmit haya sido llamado
    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());

    const calledWith = mockOnSubmit.mock.calls[0][0];

    // Validaciones básicas sobre la forma de los datos enviados
    expect(calledWith).toBeTruthy();
    expect(calledWith.name).toBe('Ibuprofeno');
    expect(calledWith.dosage).toBe('400mg');
    expect(Array.isArray(calledWith.times)).toBe(true);
    expect(calledWith.times).toEqual(['08:00']);
    expect(calledWith.startDate).toBeInstanceOf(Date);
    // Comprobar la fecha (ISO empieza con la fecha proporcionada)
    expect(calledWith.startDate.toISOString().startsWith('2025-09-18')).toBe(true);
    expect(calledWith.endDate).toBeNull();
  });
});
