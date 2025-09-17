import { useState } from 'react';
import { 
  Home, 
  Pill, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/',
    badge: null
  },
  {
    id: 'medications',
    label: 'Mis Medicamentos',
    icon: Pill,
    href: '/medicamentos',
    badge: null
  },
  {
    id: 'add-medication',
    label: 'Agregar Medicamento',
    icon: Plus,
    href: '/agregar-medicamento',
    badge: null
  },
  {
    id: 'schedule',
    label: 'Horarios',
    icon: Calendar,
    href: '/horarios',
    badge: null
  },
  {
    id: 'allergies',
    label: 'Alergias',
    icon: AlertTriangle,
    href: '/alergias',
    badge: null
  },
  {
    id: 'reports',
    label: 'Reportes',
    icon: BarChart3,
    href: '/reportes',
    badge: null
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    href: '/configuracion',
    badge: null
  }
];

const Sidebar = ({ 
  isOpen = true, 
  onToggle, 
  activeItem = 'dashboard',
  onItemClick,
  className 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (item) => {
    onItemClick?.(item);
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] bg-card border-r transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-16" : "w-64",
          "md:translate-x-0",
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header del sidebar */}
          <div className="flex items-center justify-between p-4 border-b">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-foreground">
                Navegación
              </h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleCollapse}
              className="hidden md:flex"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <li key={item.id}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start h-10",
                        isCollapsed && "px-2",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => handleItemClick(item)}
                    >
                      <Icon className={cn(
                        "h-5 w-5",
                        !isCollapsed && "mr-3"
                      )} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant={isActive ? "secondary" : "default"}
                              className="ml-2"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer del sidebar */}
          <div className="border-t p-4">
            <div className={cn(
              "flex items-center space-x-3",
              isCollapsed && "justify-center"
            )}>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  U
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    Usuario
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    usuario@ejemplo.com
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
