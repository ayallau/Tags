import type { ReactNode } from 'react';
import { cn } from '../../shared/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  cta?: ReactNode;
  variant?: 'default' | 'error' | 'info' | 'success' | 'warning';
  className?: string;
}

const variantStyles = {
  default: {
    container: 'text-muted-foreground',
    icon: 'text-muted-foreground',
    title: 'text-foreground',
    description: 'text-muted-foreground',
  },
  error: {
    container: 'text-destructive',
    icon: 'text-destructive',
    title: 'text-destructive',
    description: 'text-muted-foreground',
  },
  info: {
    container: 'text-blue-600 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-600 dark:text-blue-400',
    description: 'text-muted-foreground',
  },
  success: {
    container: 'text-green-600 dark:text-green-400',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-600 dark:text-green-400',
    description: 'text-muted-foreground',
  },
  warning: {
    container: 'text-yellow-600 dark:text-yellow-400',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-600 dark:text-yellow-400',
    description: 'text-muted-foreground',
  },
};

export function EmptyState({
  title = 'No data available',
  description,
  icon,
  cta,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        styles.container,
        className
      )}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      {icon && (
        <div className={cn('mb-4', styles.icon)}>
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className={cn('text-lg font-semibold mb-2', styles.title)}>
          {title}
        </h3>
      )}
      
      {description && (
        <p className={cn('text-sm max-w-md mb-6', styles.description)}>
          {description}
        </p>
      )}
      
      {cta && (
        <div className="focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-md">
          {cta}
        </div>
      )}
    </div>
  );
}
