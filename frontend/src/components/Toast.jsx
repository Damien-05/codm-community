import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-500/20 backdrop-blur-sm',
      border: 'border-green-500',
      text: 'text-green-400',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-red-500/20 backdrop-blur-sm',
      border: 'border-red-500',
      text: 'text-red-400',
      icon: AlertTriangle
    },
    warning: {
      bg: 'bg-yellow-500/20 backdrop-blur-sm',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
      icon: AlertTriangle
    },
    info: {
      bg: 'bg-blue-500/20 backdrop-blur-sm',
      border: 'border-blue-500',
      text: 'text-blue-400',
      icon: Info
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -50, scale: isVisible ? 1 : 0.9 }}
      className={`fixed top-4 right-4 z-50 ${style.bg} ${style.border} border-2 rounded-lg shadow-2xl max-w-md`}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className={`${style.text} h-6 w-6 flex-shrink-0`} />
        <p className={`${style.text} font-rajdhani flex-1`}>{message}</p>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className={`${style.text} hover:opacity-70 transition-opacity`}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}
