import { useToasts, useToastActions } from '../../state/ui';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../shared/lib/utils';
import type { ToastType } from '../../state/ui';

interface ToastProps {
  title?: string | undefined;
  description?: string | undefined;
  type?: ToastType | undefined;
  onClose: () => void;
}

function getToastIcon(type?: ToastType) {
  switch (type) {
    case 'success':
      return <CheckCircle className='h-5 w-5' />;
    case 'error':
      return <AlertCircle className='h-5 w-5' />;
    case 'warn':
      return <AlertTriangle className='h-5 w-5' />;
    case 'info':
    default:
      return <Info className='h-5 w-5' />;
  }
}

function getToastStyles(type?: ToastType) {
  switch (type) {
    case 'success':
      return 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400';
    case 'error':
      return 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400';
    case 'warn':
      return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400';
    case 'info':
    default:
      return 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400';
  }
}

function Toast({ title, description, type, onClose }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn('min-w-[300px] max-w-md rounded-lg border p-4 shadow-lg backdrop-blur-sm', getToastStyles(type))}
    >
      <div className='flex items-start gap-3'>
        <div className='mt-0.5'>{getToastIcon(type)}</div>
        <div className='flex-1 space-y-1'>
          {title && <p className='font-medium'>{title}</p>}
          {description && <p className='text-sm opacity-90'>{description}</p>}
        </div>
        <button
          onClick={onClose}
          className='rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2'
          aria-label='Close toast'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useToasts();
  const { removeToast } = useToastActions();

  return (
    <div className='pointer-events-none fixed bottom-4 right-4 z-[9999] flex flex-col gap-2'>
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            onClose={() => {
              removeToast(toast.id);
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
