import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MedicationForm from './forms/MedicationForm';

// Mock data para alergias - En producción vendría de la API
const mockAllergies = [
  {
    id: '1',
    name: 'Penicilina',
    severity: 'severe',
    description: 'Alergia severa a antibióticos de penicilina'
  },
  {
    id: '2',
    name: 'Aspirina',
    severity: 'moderate',
    description: 'Reacción moderada a aspirina y derivados'
  }
];

const AddMedicationPage = ({ onBack, onMedicationAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [allergies] = useState(mockAllergies);

  const handleSubmit = async (medicationData) => {
    setIsLoading(true);
    
    try {
      // Simular llamada a la API
      console.log('Enviando medicamento:', medicationData);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular respuesta exitosa
      const newMedication = {
        id: Date.now().toString(),
        ...medicationData,
        isActive: true,
        takes: []
      };
      
      setShowSuccess(true);
      
      // Notificar al componente padre
      onMedicationAdded?.(newMedication);
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
        onBack?.();
      }, 3000);
      
    } catch (error) {
      console.error('Error al agregar medicamento:', error);
      // Aquí se manejaría el error (mostrar toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onBack?.();
  };

  if (showSuccess) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  ¡Medicamento Agregado!
                </h3>
                <p className="text-muted-foreground">
                  El medicamento ha sido registrado exitosamente y los recordatorios han sido programados.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Redirigiendo automáticamente...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Agregar Medicamento
          </h1>
          <p className="text-muted-foreground">
            Registra un nuevo medicamento y programa sus recordatorios
          </p>
        </div>
      </div>

      {/* Información sobre alergias */}
      {allergies.length > 0 && (
        <Alert>
          <AlertDescription>
            <strong>Verificación de Alergias:</strong> Tienes {allergies.length} alergia(s) registrada(s). 
            El sistema verificará automáticamente si el medicamento que agregues puede estar relacionado 
            con alguna de tus alergias conocidas.
          </AlertDescription>
        </Alert>
      )}

      {/* Formulario */}
      <div className="max-w-4xl">
        <MedicationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          allergies={allergies}
        />
      </div>

      {/* Información adicional */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Información Importante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-foreground mb-2">Recordatorios</h4>
              <p className="text-sm text-muted-foreground">
                Una vez agregado el medicamento, recibirás notificaciones en los horarios programados 
                para recordarte tomar tus dosis.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Verificación de Alergias</h4>
              <p className="text-sm text-muted-foreground">
                El sistema verificará automáticamente si el medicamento puede estar relacionado 
                con alguna de tus alergias registradas.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Seguimiento</h4>
              <p className="text-sm text-muted-foreground">
                Podrás marcar cada dosis como tomada y ver tu progreso de adherencia al tratamiento.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Modificaciones</h4>
              <p className="text-sm text-muted-foreground">
                Puedes editar o eliminar el medicamento en cualquier momento desde la sección 
                "Mis Medicamentos".
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMedicationPage;
