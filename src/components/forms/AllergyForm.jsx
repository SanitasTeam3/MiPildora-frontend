import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Save, 
  X,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ALLERGY_SEVERITY } from '../../types';

// Schema de validación con Zod
const allergySchema = z.object({
  name: z.string()
    .min(2, 'El nombre del alérgeno debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  severity: z.enum([ALLERGY_SEVERITY.MILD, ALLERGY_SEVERITY.MODERATE, ALLERGY_SEVERITY.SEVERE], {
    required_error: 'La severidad es requerida'
  }),
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  symptoms: z.array(z.object({
    symptom: z.string()
      .min(2, 'El síntoma debe tener al menos 2 caracteres')
      .max(100, 'El síntoma no puede exceder 100 caracteres')
  })).min(1, 'Debe especificar al menos un síntoma')
});

const severityOptions = [
  { 
    value: ALLERGY_SEVERITY.MILD, 
    label: 'Leve', 
    description: 'Síntomas menores, no requiere atención médica inmediata',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
  },
  { 
    value: ALLERGY_SEVERITY.MODERATE, 
    label: 'Moderada', 
    description: 'Síntomas notables, puede requerir medicación',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
  },
  { 
    value: ALLERGY_SEVERITY.SEVERE, 
    label: 'Severa', 
    description: 'Síntomas graves, requiere atención médica inmediata',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
  }
];

const commonSymptoms = [
  'Erupción cutánea',
  'Picazón',
  'Hinchazón',
  'Dificultad para respirar',
  'Náuseas',
  'Vómitos',
  'Diarrea',
  'Dolor de cabeza',
  'Mareos',
  'Anafilaxia'
];

const AllergyForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState(initialData?.severity || '');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm({
    resolver: zodResolver(allergySchema),
    defaultValues: initialData || {
      name: '',
      severity: '',
      description: '',
      symptoms: [{ symptom: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'symptoms'
  });

  const watchedSeverity = watch('severity');

  // Actualizar severidad seleccionada cuando cambia
  useState(() => {
    setSelectedSeverity(watchedSeverity);
  }, [watchedSeverity]);

  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      symptoms: data.symptoms.map(s => s.symptom).filter(s => s.trim() !== '')
    };
    
    onSubmit(formattedData);
  };

  const addSymptom = () => {
    append({ symptom: '' });
  };

  const removeSymptom = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const addCommonSymptom = (symptom) => {
    const currentSymptoms = fields.map(field => field.symptom);
    if (!currentSymptoms.includes(symptom)) {
      append({ symptom });
    }
  };

  const getSeverityInfo = (severity) => {
    return severityOptions.find(option => option.value === severity);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Información de la Alergia</span>
          </CardTitle>
          <CardDescription>
            Registra información detallada sobre la alergia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nombre del alérgeno */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Alérgeno *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ej: Penicilina, Maní, Polen..."
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Severidad */}
          <div className="space-y-2">
            <Label htmlFor="severity">Severidad *</Label>
            <Select onValueChange={(value) => setValue('severity', value)}>
              <SelectTrigger className={errors.severity ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona la severidad" />
              </SelectTrigger>
              <SelectContent>
                {severityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <Badge className={option.color}>
                        {option.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.severity && (
              <p className="text-sm text-red-600">{errors.severity.message}</p>
            )}
            
            {/* Información sobre la severidad seleccionada */}
            {selectedSeverity && (
              <Alert className="mt-2">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>{getSeverityInfo(selectedSeverity)?.label}:</strong>{' '}
                  {getSeverityInfo(selectedSeverity)?.description}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe la alergia, cuándo se descubrió, circunstancias, etc."
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Síntomas */}
      <Card>
        <CardHeader>
          <CardTitle>Síntomas Asociados</CardTitle>
          <CardDescription>
            Lista los síntomas que experimentas con esta alergia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Síntomas comunes */}
          <div className="space-y-2">
            <Label>Síntomas Comunes (Click para agregar)</Label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symptom, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addCommonSymptom(symptom)}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {symptom}
                </Button>
              ))}
            </div>
          </div>

          {/* Síntomas personalizados */}
          <div className="space-y-2">
            <Label>Síntomas Específicos *</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    {...register(`symptoms.${index}.symptom`)}
                    placeholder="Ej: Erupción en brazos, dificultad para respirar..."
                    className={errors.symptoms?.[index]?.symptom ? 'border-red-500' : ''}
                  />
                  {errors.symptoms?.[index]?.symptom && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.symptoms[index].symptom.message}
                    </p>
                  )}
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSymptom(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addSymptom}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Síntoma
            </Button>
            
            {errors.symptoms && (
              <p className="text-sm text-red-600">{errors.symptoms.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advertencia importante */}
      {selectedSeverity === ALLERGY_SEVERITY.SEVERE && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>Advertencia Importante:</strong> Has marcado esta alergia como severa. 
            Asegúrate de que todos tus medicamentos sean verificados contra esta alergia 
            antes de tomarlos. Considera llevar siempre contigo información sobre esta alergia 
            y medicación de emergencia si ha sido prescrita.
          </AlertDescription>
        </Alert>
      )}

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
              {initialData ? 'Actualizar Alergia' : 'Registrar Alergia'}
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

export default AllergyForm;
