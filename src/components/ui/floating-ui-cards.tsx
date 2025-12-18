import React from 'react';
import { motion } from 'framer-motion';
import { InventoryCard } from './inventory-card';
import { AlertCard } from './alert-card';
import { GraphCard } from './graph-card';

export function FloatingUICards() {
  return (
    <div className="relative mt-8 overflow-visible px-2 sm:px-4 sm:mt-12 md:px-6 md:mt-20 mx-auto max-w-6xl">
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative"
        style={{ perspective: '1200px' }}
      >
        {/* Inventory Card - 4s duration, left card with rotateY(8deg) */}
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateY(8deg)',
          }}
        >
          <InventoryCard />
        </motion.div>

        {/* Alert Card - 5s duration, center card shifted 30px higher */}
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            transformStyle: 'preserve-3d',
            marginTop: '-30px',
          }}
        >
          <AlertCard />
        </motion.div>

        {/* Graph Card - 6s duration, right card with rotateY(-8deg) */}
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateY(-8deg)',
          }}
        >
          <GraphCard />
        </motion.div>
      </div>
    </div>
  );
}

