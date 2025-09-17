import { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard';
import AddMedicationPage from './components/AddMedicationPage';
import { AppProvider, useAppContext } from './hooks/useAppContext.jsx';
import { useMedications } from './hooks/useMedications';
import { useAllergies } from './hooks/useAllergies';
import './App.css';

// Componente principal de la aplicación
const AppContent = () => {
  const { state, actions } = useAppContext();
  const { medications, addMedication } = useMedications();
  const { allergies } = useAllergies();
  const [currentView, setCurrentView] = useState('dashboard');

  const handleNavigationClick = (item) => {
    setCurrentView(item.id);
    actions.setCurrentView(item.id);
    
    // Cerrar sidebar en móvil después de navegar
    if (window.innerWidth < 768) {
      actions.setSidebarOpen(false);
    }
  };

  const handleMedicationAdded = (newMedication) => {
    actions.showToast('Medicamento agregado exitosamente', 'success');
    
    // Actualizar estadísticas
    actions.updateStats({
      totalMedications: medications.length + 1,
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
        
      case 'medications':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Mis Medicamentos
              </h1>
              <p className="text-muted-foreground">
                Gestiona todos tus medicamentos activos
              </p>
            </div>
            
            <div className="grid gap-4">
              {medications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No tienes medicamentos registrados
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Comienza agregando tu primer medicamento para recibir recordatorios
                  </p>
                  <button
                    onClick={() => setCurrentView('add-medication')}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Agregar Medicamento
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Lista de medicamentos próximamente disponible
                  </p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'add-medication':
        return (
          <AddMedicationPage
            onBack={() => setCurrentView('dashboard')}
            onMedicationAdded={handleMedicationAdded}
          />
        );
        
      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Horarios
              </h1>
              <p className="text-muted-foreground">
                Vista de calendario con tus horarios de medicación
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Vista de Calendario
              </h3>
              <p className="text-muted-foreground">
                Próximamente: Vista de calendario interactiva con todos tus horarios de medicación
              </p>
            </div>
          </div>
        );
        
      case 'allergies':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Alergias
              </h1>
              <p className="text-muted-foreground">
                Gestiona tu información de alergias para mayor seguridad
              </p>
            </div>
            
            <div className="grid gap-4">
              {allergies.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No tienes alergias registradas
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Registra tus alergias para recibir advertencias al agregar medicamentos
                  </p>
                  <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    Registrar Alergia
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Gestión de alergias próximamente disponible
                  </p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'reports':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Reportes
              </h1>
              <p className="text-muted-foreground">
                Analiza tu adherencia al tratamiento y progreso
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Reportes y Estadísticas
              </h3>
              <p className="text-muted-foreground">
                Próximamente: Gráficos detallados de adherencia, tendencias y análisis de tu tratamiento
              </p>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Configuración
              </h1>
              <p className="text-muted-foreground">
                Personaliza tu experiencia en la aplicación
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Configuración de la Aplicación
              </h3>
              <p className="text-muted-foreground">
                Próximamente: Configuración de notificaciones, preferencias de usuario y más opciones
              </p>
            </div>
          </div>
        );
        
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      activeItem={currentView}
      onNavigationClick={handleNavigationClick}
    >
      {renderCurrentView()}
    </Layout>
  );
};

// Componente App principal con Provider
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
