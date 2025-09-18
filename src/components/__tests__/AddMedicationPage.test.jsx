import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddMedicationPage from '../AddMedicationPage';

// Mock the MedicationForm to control submission without rendering the actual form
jest.mock('../forms/MedicationForm', () => ({
  __esModule: true,
  default: ({ onSubmit }) => (
    <div>
      <button onClick={() => onSubmit({ name: 'Paracetamol', dosage: '500mg' })}>
        Enviar prueba
      </button>
    </div>
  )
}));

describe('AddMedicationPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('muestra alerta de alergias y procesa el envío mostrando éxito y redirigiendo', async () => {
    const mockOnMedicationAdded = jest.fn();
    const mockOnBack = jest.fn();

    render(
      <AddMedicationPage onBack={mockOnBack} onMedicationAdded={mockOnMedicationAdded} />
    );

    // Verificar que la alerta de alergias se muestre usando role=alert
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(within(alert).getByText(/Verificación de Alergias/i)).toBeInTheDocument();
    expect(within(alert).getByText(/Tienes 2 alergia\(s\)/i)).toBeInTheDocument();

    // Disparar el envío desde el MedicationForm mock
    const btn = screen.getByText('Enviar prueba');
    await userEvent.click(btn);

    // Esperar a que onMedicationAdded sea llamado (espera hasta 10s)
    await waitFor(() => expect(mockOnMedicationAdded).toHaveBeenCalled(), { timeout: 10000 });
    const calledWith = mockOnMedicationAdded.mock.calls[0][0];
    expect(calledWith).toMatchObject({ name: 'Paracetamol', dosage: '500mg' });

    // Esperar a que aparezca la pantalla de éxito
    await waitFor(() => {
      expect(screen.getByText(/¡Medicamento Agregado!/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Esperar a que onBack sea llamado por la redirección automática (espera hasta 15s)
    await waitFor(() => expect(mockOnBack).toHaveBeenCalled(), { timeout: 15000 });
  }, 30000);
});
