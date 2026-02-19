import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = 'Chargement...' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className={`${sizeClasses[size]} border-t-4 border-b-4 border-cod-orange rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-gray-400 font-rajdhani"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
