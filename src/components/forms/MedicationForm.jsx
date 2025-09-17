import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  Pill,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MEDICATION_FREQUENCY } from '../../types';

// Schema de validación con Zod
const medicationSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  dosage: z.string()
    .min(1, 'La dosis es requerida')
    .max(50, 'La dosis no puede exceder 50 caracteres'),
  frequency: z.string()
    .min(1, 'La frecuencia es requerida'),
  times: z.array(z.object({
    time: z.string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)')
  })).min(1, 'Debe especificar al menos un horario'),
  startDate: z.string()
    .min(1, 'La fecha de inicio es requerida'),
  endDate: z.string()
    .optional(),
  notes: z.string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional()
});

const frequencyOptions = [
  { value: MEDICATION_FREQUENCY.ONCE_DAILY, label: 'Una vez al día', times: 1 },
  { value: MEDICATION_FREQUENCY.TWICE_DAILY, label: 'Dos veces al día', times: 2 },
  { value: MEDICATION_FREQUENCY.THREE_TIMES_DAILY, label: 'Tres veces al día', times: 3 },
  { value: MEDICATION_FREQUENCY.FOUR_TIMES_DAILY, label: 'Cuatro veces al día', times: 4 },
  { value: MEDICATION_FREQUENCY.EVERY_8_HOURS, label: 'Cada 8 horas', times: 3 },
  { value: MEDICATION_FREQUENCY.EVERY_12_HOURS, label: 'Cada 12 horas', times: 2 },
  { value: MEDICATION_FREQUENCY.AS_NEEDED, label: 'Según necesidad', times: 0 },
  { value: MEDICATION_FREQUENCY.CUSTOM, label: 'Personalizado', times: 0 }
];

const defaultTimes = {
  [MEDICATION_FREQUENCY.ONCE_DAILY]: ['08:00'],
  [MEDICATION_FREQUENCY.TWICE_DAILY]: ['08:00', '20:00'],
  [MEDICATION_FREQUENCY.THREE_TIMES_DAILY]: ['08:00', '14:00', '20:00'],
  [MEDICATION_FREQUENCY.FOUR_TIMES_DAILY]: ['08:00', '12:00', '16:00', '20:00'],
  [MEDICATION_FREQUENCY.EVERY_8_HOURS]: ['08:00', '16:00', '00:00'],
  [MEDICATION_FREQUENCY.EVERY_12_HOURS]: ['08:00', '20:00']
};

const MedicationForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  allergies = [] 
}) => {
  const [allergyWarnings, setAllergyWarnings] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm({
    resolver: zodResolver(medicationSchema),
    defaultValues: initialData || {
      name: '',
      dosage: '',
      frequency: '',
      times: [{ time: '' }],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'times'
  });

  const watchedFrequency = watch('frequency');
  const watchedName = watch('name');

  // Verificar alergias cuando cambia el nombre del medicamento
  useState(() => {
    if (watchedName && allergies.length > 0) {
      const warnings = allergies.filter(allergy => 
        watchedName.toLowerCase().includes(allergy.name.toLowerCase())
      );
      setAllergyWarnings(warnings);
    } else {
      setAllergyWarnings([]);
    }
  }, [watchedName, allergies]);

  // Actualizar horarios cuando cambia la frecuencia
  useState(() => {
    if (watchedFrequency && defaultTimes[watchedFrequency]) {
      const newTimes = defaultTimes[watchedFrequency].map(time => ({ time }));
      setValue('times', newTimes);
    }
  }, [watchedFrequency, setValue]);

  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      times: data.times.map(t => t.time),
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null
    };
    
    onSubmit(formattedData);
  };

  const addTimeSlot = () => {
    append({ time: '' });
  };

  const removeTimeSlot = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Pill className="h-5 w-5" />
            <span>Información del Medicamento</span>
          </CardTitle>
          <CardDescription>
            Ingresa los datos básicos del medicamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nombre del medicamento */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Medicamento *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ej: Ibuprofeno, Paracetamol..."
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Advertencias de alergias */}
          {allergyWarnings.length > 0 && (
            <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <strong>Advertencia de Alergia:</strong> Este medicamento puede estar relacionado con las siguientes alergias registradas:
                <div className="mt-2 space-x-2">
                  {allergyWarnings.map((allergy, index) => (
                    <Badge key={index} variant="destructive">
                      {allergy.name} ({allergy.severity})
                    </Badge>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Dosis */}
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosis *</Label>
            <Input
              id="dosage"
              {...register('dosage')}
              placeholder="Ej: 400mg, 1 comprimido, 5ml..."
              className={errors.dosage ? 'border-red-500' : ''}
            />
            {errors.dosage && (
              <p className="text-sm text-red-600">{errors.dosage.message}</p>
            )}
          </div>

          {/* Frecuencia */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Frecuencia *</Label>
            <Select onValueChange={(value) => setValue('frequency', value)}>
              <SelectTrigger className={errors.frequency ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona la frecuencia" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.frequency && (
              <p className="text-sm text-red-600">{errors.frequency.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Horarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Horarios de Toma</span>
          </CardTitle>
          <CardDescription>
            Especifica los horarios en que debes tomar el medicamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  type="time"
                  {...register(`times.${index}.time`)}
                  className={errors.times?.[index]?.time ? 'border-red-500' : ''}
                />
                {errors.times?.[index]?.time && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.times[index].time.message}
                  </p>
                )}
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeTimeSlot(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addTimeSlot}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Horario
          </Button>
          
          {errors.times && (
            <p className="text-sm text-red-600">{errors.times.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Fechas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Período de Tratamiento</span>
          </CardTitle>
          <CardDescription>
            Define el período durante el cual tomarás este medicamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha de inicio */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            {/* Fecha de fin */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de Fin (Opcional)</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notas adicionales */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Adicionales</CardTitle>
          <CardDescription>
            Información adicional sobre el medicamento (opcional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            {...register('notes')}
            placeholder="Ej: Tomar con comida, efectos secundarios observados..."
            rows={3}
            className={errors.notes ? 'border-red-500' : ''}
          />
          {errors.notes && (
            <p className="text-sm text-red-600 mt-2">{errors.notes.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="flex-1 sm:flex-none"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {initialData ? 'Actualizar Medicamento' : 'Agregar Medicamento'}
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default MedicationForm;
