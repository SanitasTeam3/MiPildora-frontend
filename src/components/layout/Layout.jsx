import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

const Layout = ({ children, activeItem = 'dashboard', onNavigationClick }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [pendingMedications, setPendingMedications] = useState(3); // Mock data

  // Inicializar modo oscuro desde localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Manejar cambio de modo oscuro
  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Manejar toggle del sidebar
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Manejar click en item de navegación
  const handleNavigationClick = (item) => {
    onNavigationClick?.(item);
    setSidebarOpen(false); // Cerrar sidebar en móvil
  };

  // Manejar click en notificaciones
  const handleNotificationsClick = () => {
    console.log('Abriendo notificaciones');
    // Aquí se implementaría la lógica de notificaciones
  };

  // Cerrar sidebar al hacer click fuera (solo móvil)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        onMenuToggle={handleSidebarToggle}
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
        pendingMedications={pendingMedications}
        onNotificationsClick={handleNotificationsClick}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={handleSidebarToggle}
          activeItem={activeItem}
          onItemClick={handleNavigationClick}
        />

        {/* Contenido principal */}
        <main 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            "md:ml-64", // Espacio para sidebar en desktop
            "min-h-[calc(100vh-4rem)]" // Altura mínima menos el header
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
