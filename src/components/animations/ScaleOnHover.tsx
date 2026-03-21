'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type ScaleOnHoverProps = {
  children: ReactNode;
  className?: string;
  scale?: number;
};

export function ScaleOnHover({ children, className, scale = 1.05 }: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
