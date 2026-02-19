import { motion } from 'framer-motion';
import { AlertCircle, XCircle } from 'lucide-react';

export default function ErrorMessage({ 
  message = 'Une erreur est survenue', 
  onRetry = null,
  type = 'error' // 'error' | 'warning' | 'info'
}) {
  const styles = {
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/50',
      text: 'text-red-400',
      icon: XCircle
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      icon: AlertCircle
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      icon: AlertCircle
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${style.bg} ${style.border} border rounded-lg p-4 mb-4`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`${style.text} h-5 w-5 mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <p className={`${style.text} font-rajdhani`}>{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-cod-orange hover:text-cod-lightOrange underline"
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
