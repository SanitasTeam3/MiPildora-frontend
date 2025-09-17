# Sanitas - Aplicación de Recordatorio de Medicación

Una aplicación web moderna desarrollada en React para gestionar medicamentos y recordatorios de toma, diseñada específicamente para el Hackathon F5 de septiembre de 2025.

## 📋 Descripción del Proyecto

Esta aplicación permite a los usuarios registrar sus medicamentos, programar recordatorios para las tomas, gestionar alergias y realizar un seguimiento de su adherencia al tratamiento. La interfaz está inspirada en el diseño de Sanitas, con un enfoque mobile-first y completamente responsive.

## ✨ Características Principales

### Funcionalidades Esenciales (Implementadas)
- ✅ **Registro de medicamentos** con persistencia de datos
- ✅ **Formularios avanzados** con React Hook Form y validaciones con Zod
- ✅ **Dashboard interactivo** con estadísticas en tiempo real
- ✅ **Diseño responsive** mobile-first basado en el logo de Sanitas
- ✅ **Navegación intuitiva** con sidebar colapsible
- ✅ **Sistema de notificaciones** con toasts personalizados
- ✅ **Modo oscuro** con persistencia en localStorage
- ✅ **Arquitectura modular** con componentes reutilizables

### Funcionalidades Opcionales (Preparadas)
- 🔄 **Gestión de alergias** con validación cruzada
- 🔄 **Notificaciones visuales** para horarios de toma
- 🔄 **Filtros avanzados** (activo vs. histórico)
- 🔄 **Cálculo de dosis restantes**
- 🔄 **Reportes y estadísticas** de adherencia
- 🔄 **Accesibilidad mejorada** con ARIA labels

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.1.0** - Biblioteca principal de UI
- **Vite 6.3.5** - Herramienta de build y desarrollo
- **Tailwind CSS 4.1.7** - Framework de estilos
- **shadcn/ui** - Componentes de UI pre-construidos
- **Lucide React** - Iconografía moderna
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Framer Motion** - Animaciones (pre-instalado)

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **pnpm** - Gestor de paquetes

## 🏗️ Arquitectura del Proyecto

```
src/
├── assets/                 # Recursos estáticos (imágenes, logos)
├── components/            
│   ├── forms/             # Formularios con React Hook Form
│   ├── layout/            # Componentes de layout (Header, Sidebar)
│   ├── medication/        # Componentes específicos de medicación
│   └── ui/                # Componentes de UI reutilizables
├── hooks/                 # Hooks personalizados
│   ├── useAppContext.jsx  # Contexto global de la aplicación
│   ├── useMedications.js  # Hook para gestión de medicamentos
│   └── useAllergies.js    # Hook para gestión de alergias
├── services/              # Servicios de API
│   └── medicationService.js # Cliente API REST
├── types/                 # Definiciones de tipos y constantes
├── utils/                 # Utilidades y helpers
├── App.jsx               # Componente principal
├── App.css               # Estilos globales
└── main.jsx              # Punto de entrada
```

## 🎨 Sistema de Diseño

### Paleta de Colores (Basada en Sanitas)
- **Azul Principal**: `#00BFFF` (Sanitas Blue)
- **Azul Oscuro**: `#0099CC`
- **Azul Claro**: `#33CCFF`
- **Gradientes**: Implementados para elementos destacados

### Componentes de UI
- **Tarjetas**: Con sombras suaves y bordes redondeados
- **Botones**: Estados hover y focus bien definidos
- **Formularios**: Validación visual en tiempo real
- **Notificaciones**: Sistema de toasts con diferentes tipos
- **Navegación**: Sidebar responsive con iconografía clara

## 📱 Responsive Design

La aplicación está optimizada para múltiples dispositivos:

- **Mobile First**: Diseño prioritario para dispositivos móviles
- **Breakpoints**: Configurados según estándares de Tailwind CSS
- **Navegación Adaptativa**: Sidebar que se convierte en overlay en móvil
- **Tipografía Escalable**: Tamaños de fuente que se adaptan al dispositivo

## 🔌 Integración con Backend

### Endpoints API Preparados

```javascript
// Medicamentos
POST   /medicamentos           // Crear medicamento
GET    /medicamentos           // Obtener todos los medicamentos
PUT    /medicamentos/:id       // Actualizar medicamento
DELETE /medicamentos/:id       // Eliminar medicamento
PUT    /medicamentos/:id/tomado // Marcar como tomado

// Alergias (Opcional)
POST   /alergias              // Crear alergia
GET    /alergias              // Obtener alergias
PUT    /alergias/:id          // Actualizar alergia
DELETE /alergias/:id          // Eliminar alergia
```

### Configuración de API
```javascript
// En .env
REACT_APP_API_URL=http://localhost:3001/api
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Instalación
```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd sanitas-medication-app

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev

# Construir para producción
pnpm run build

# Previsualizar build de producción
pnpm run preview
```

### Variables de Entorno
```bash
# .env
REACT_APP_API_URL=http://localhost:3001/api
```

## 🧪 Testing

### Estructura de Testing (Preparada)
```bash
# Ejecutar tests unitarios
pnpm run test

# Ejecutar tests con cobertura
pnpm run test:coverage

# Ejecutar tests en modo watch
pnpm run test:watch
```

### Cobertura Objetivo
- **Mínimo**: 75% de cobertura de código
- **Componentes**: Tests unitarios para todos los componentes principales
- **Hooks**: Tests para hooks personalizados
- **Servicios**: Tests para servicios de API

## 📊 Funcionalidades Implementadas

### Dashboard
- **Estadísticas en tiempo real**: Medicamentos activos, dosis tomadas, adherencia
- **Próximas dosis**: Lista interactiva con acciones rápidas
- **Acciones rápidas**: Botones para funciones principales

### Gestión de Medicamentos
- **Formulario completo**: Nombre, dosis, frecuencia, horarios
- **Validaciones robustas**: Con Zod y React Hook Form
- **Verificación de alergias**: Advertencias automáticas
- **Horarios flexibles**: Configuración personalizada

### Sistema de Navegación
- **Sidebar responsive**: Se adapta a diferentes tamaños de pantalla
- **Navegación por pestañas**: Dashboard, Medicamentos, Horarios, etc.
- **Estados activos**: Indicación visual de la sección actual

## 🔧 Configuración Avanzada

### Personalización de Tema
```css
/* En App.css */
:root {
  --sanitas-blue: #00BFFF;
  --sanitas-blue-dark: #0099CC;
  --sanitas-blue-light: #33CCFF;
}
```

### Configuración de Tailwind
```javascript
// tailwind.config.js personalizado disponible
// Incluye colores de Sanitas y configuraciones responsive
```

## 🚀 Despliegue

### Opciones de Despliegue
- **Vercel**: Configuración automática con Git
- **Netlify**: Deploy continuo
- **GitHub Pages**: Para demos estáticas
- **Docker**: Containerización disponible

### Build de Producción
```bash
pnpm run build
# Genera carpeta dist/ lista para despliegue
```

## 🤝 Contribución

### Estándares de Código
- **ESLint**: Configuración estricta
- **Prettier**: Formateo automático
- **Commits**: Mensajes descriptivos
- **Branches**: Feature branches para nuevas funcionalidades

### Estructura de Commits
```
feat: agregar nueva funcionalidad
fix: corregir bug
docs: actualizar documentación
style: cambios de estilo
refactor: refactorización de código
test: agregar o modificar tests
```

## 📈 Roadmap

### Próximas Funcionalidades
1. **Notificaciones Push**: Recordatorios del navegador
2. **Sincronización**: Backup en la nube
3. **Reportes Avanzados**: Gráficos de adherencia
4. **Integración Médica**: Conexión con sistemas de salud
5. **Modo Offline**: Funcionalidad sin conexión

## 📞 Soporte

### Documentación Adicional
- **Componentes**: Documentación inline en cada componente
- **Hooks**: Ejemplos de uso en archivos de hook
- **API**: Documentación completa en servicios

### Resolución de Problemas
- **Logs**: Verificar consola del navegador
- **Network**: Comprobar llamadas a API
- **Estado**: Usar React DevTools para debugging

## 📄 Licencia

Este proyecto fue desarrollado para el Hackathon F5 de septiembre de 2025.

---

**Desarrollado con ❤️ para mejorar la adherencia al tratamiento médico**

*Aplicación diseñada siguiendo las mejores prácticas de desarrollo web moderno y centrada en la experiencia del usuario.*
