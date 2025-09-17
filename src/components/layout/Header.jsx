import { useState } from 'react';
import { Bell, Menu, Moon, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import sanitasLogo from '../../assets/sanitas-logo.png';

const Header = ({ 
  onMenuToggle, 
  darkMode, 
  onDarkModeToggle, 
  pendingMedications = 0,
  onNotificationsClick 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                src={sanitasLogo} 
                alt="Sanitas" 
                className="h-8 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground">
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
            {/* Notificaciones */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={onNotificationsClick}
            >
              <Bell className="h-5 w-5" />
              {pendingMedications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {pendingMedications > 9 ? '9+' : pendingMedications}
                </Badge>
              )}
              <span className="sr-only">
                Notificaciones {pendingMedications > 0 && `(${pendingMedications})`}
              </span>
            </Button>

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
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Ayuda
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
