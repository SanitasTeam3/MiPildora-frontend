import { useState } from 'react';
import { Menu, Moon, Sun, User, LogIn, UserPlus } from 'lucide-react'; // Importamos nuevos íconos
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LogoMiPíldora from '../../assets/LogoMiPíldora.png';

const Header = ({ 
  onMenuToggle, 
  darkMode, 
  onDarkModeToggle
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <--- Nuevo estado para el login

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.();
  };

  const handleLogout = () => {
    // Aquí pondrías la lógica real para cerrar sesión
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    // Aquí pondrías la lógica para redirigir a la página de login
    alert('Redireccionando a la página de login');
  };

  const handleRegister = () => {
    // Aquí pondrías la lógica para redirigir a la página de registro
    alert('Redireccionando a la página de registro');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={handleMenuToggle}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <img 
                src={LogoMiPíldora} 
                alt="Sanitas" 
                className="h-16 w-auto"
              />
              <div className="hidden sm:block" >
                <h1 className="text-lg font-semibold text-foreground ">
                  Recordatorio de Medicación
                </h1>
                <p className="text-xs text-muted-foreground">
                  Gestiona tu salud con confianza
                </p>
              </div>
            </div>
          </div>

          {/* Acciones del header */}
          <div className="flex items-center space-x-2">
            {/* Toggle modo oscuro */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onDarkModeToggle}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">
                Cambiar a modo {darkMode ? 'claro' : 'oscuro'}
              </span>
            </Button>

            {/* Menú de usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Menú de usuario</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleLogin}>
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Iniciar Sesión</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleRegister}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Registrarse</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;