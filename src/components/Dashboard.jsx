import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, AlertTriangle, TrendingUp, Pill, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useMedications } from '../hooks/useMedications';
import { useAppContext } from '../hooks/useAppContext';
import { InlineLoading, CardSkeleton } from './ui/Loading';

const Dashboard = ({ onNavigate }) => {
  const { medications, loading, error, loadMedications } = useMedications();
  const { state } = useAppContext();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Cargar medicamentos al montar el componente
  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  // Calcular estadísticas desde los datos reales del backend
  const stats = {
    totalMedications: medications?.length || 0,
    activeMedications: medications?.filter(med => med.status === 'active')?.length || 0,
    todayDoses: medications?.reduce((total, med) => {
      // Calcular dosis de hoy basado en la frecuencia del medicamento
      return total + (med.times?.length || 0);
    }, 0) || 0,
    adherenceRate: 0 // Se calculará cuando lleguen los datos de adherencia del backend
  };

  const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => (
    <Card className="text-center py-8">
      <CardContent className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">{description}</p>
        </div>
        {actionText && onAction && (
          <Button onClick={onAction} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <CardSkeleton className="h-64" />
          <CardSkeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Error al cargar los datos: {error.message}</span>
          </div>
          <Button 
            variant="outline" 
            onClick={loadMedications}
            className="mt-4"
          >
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con saludo personalizado */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          ¡Hola! 👋
        </h1>
        <p className="text-muted-foreground">
          {formatDate(currentTime)} - {formatTime(currentTime)}
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medicamentos Activos
            </CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMedications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalMedications} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dosis de Hoy
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayDoses}</div>
            <p className="text-xs text-muted-foreground">
              Programadas para hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Adherencia
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adherenceRate}%</div>
            <Progress value={stats.adherenceRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.adherenceRate === 0 ? 'Sin datos aún' : 'Esta semana'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estado General
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={stats.activeMedications > 0 ? "default" : "secondary"}>
                {stats.activeMedications > 0 ? 'Activo' : 'Sin medicamentos'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Estado del tratamiento
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Próximas dosis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Próximas Dosis</span>
            </CardTitle>
            <CardDescription>
              Medicamentos programados para las próximas horas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.activeMedications === 0 ? (
              <EmptyState
                icon={Clock}
                title="No hay dosis programadas"
                description="Agrega medicamentos para ver tus próximas dosis aquí"
                actionText="Agregar Medicamento"
                onAction={() => onNavigate?.('add-medication')}
              />
            ) : (
              <div className="space-y-3">
                {medications?.length > 0 ? (
                  medications.slice(0, 3).map((medication) => (
                    <div 
                      key={medication.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Pill className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h4 className="text-sm font-medium">{medication.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {medication.dosage} - Próxima: {medication.times?.[0]?.time || 'No programada'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {medication.frequency}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <InlineLoading text="Cargando próximas dosis..." />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede rápidamente a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate?.('add-medication')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Medicamento
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate?.('medications')}
            >
              <Pill className="h-4 w-4 mr-2" />
              Ver Mis Medicamentos
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate?.('schedule')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Ver Horarios
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate?.('allergies')}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Gestionar Alergias
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Mensaje de bienvenida si no hay medicamentos */}
      {stats.totalMedications === 0 && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">¡Bienvenido a Sanitas!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Comienza agregando tus medicamentos para llevar un control completo 
                  de tu tratamiento y nunca olvidar una dosis.
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={() => onNavigate?.('add-medication')}
                className="mt-4"
              >
                <Plus className="h-5 w-5 mr-2" />
                Agregar Mi Primer Medicamento
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
