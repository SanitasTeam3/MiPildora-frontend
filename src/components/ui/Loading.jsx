import { cn } from '@/lib/utils';

// Spinner básico
export const Spinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
        sizeClasses[size],
        className
      )}
    />
  );
};

// Loading con texto
export const LoadingWithText = ({ text = 'Cargando...', size = 'md' }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Spinner size={size} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
};

// Loading de página completa
export const PageLoading = ({ text = 'Cargando aplicación...' }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border rounded-lg p-8 shadow-lg">
        <LoadingWithText text={text} size="lg" />
      </div>
    </div>
  );
};

// Loading inline
export const InlineLoading = ({ text, className }) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Spinner size="sm" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

// Loading para botones
export const ButtonLoading = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
      <span>Cargando...</span>
    </div>
  );
};

// Loading skeleton para tarjetas
export const CardSkeleton = ({ className }) => {
  return (
    <div className={cn('bg-card border rounded-lg p-4 animate-pulse', className)}>
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton para lista
export const ListSkeleton = ({ items = 3, className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 animate-pulse">
          <div className="h-10 w-10 bg-muted rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading con pulso (heartbeat)
export const HeartbeatLoading = ({ className }) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative">
        <div className="h-8 w-8 bg-primary rounded-full animate-ping absolute"></div>
        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
          <svg className="h-4 w-4 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
