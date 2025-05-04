import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Cursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', mouseMove);

    // Add event listeners for interactive elements
    const links = document.querySelectorAll('a, button, .interactive');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', () => setCursorVariant('hover'));
      link.addEventListener('mouseleave', () => setCursorVariant('default'));
    });

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      
      links.forEach(link => {
        link.removeEventListener('mouseenter', () => setCursorVariant('hover'));
        link.removeEventListener('mouseleave', () => setCursorVariant('default'));
      });
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: 'rgba(100, 255, 218, 0)',
      border: '2px solid rgba(100, 255, 218, 0.5)',
      transition: {
        type: 'spring',
        mass: 0.6
      }
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: 'rgba(100, 255, 218, 0.1)',
      border: '2px solid rgba(100, 255, 218, 0.8)',
      transition: {
        type: 'spring',
        mass: 0.6
      }
    }
  };

  // Only show custom cursor on non-touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
    return (
      <>
        <motion.div
          className="cursor-dot hidden md:block fixed top-0 left-0 rounded-full pointer-events-none z-50"
          variants={variants}
          animate={cursorVariant}
        />
        <motion.div
          className="cursor-dot-outline hidden md:block fixed top-0 left-0 rounded-full pointer-events-none z-50"
          animate={{
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
          }}
          transition={{
            type: 'spring',
            mass: 0.3
          }}
          style={{
            height: 16,
            width: 16,
            backgroundColor: 'rgba(100, 255, 218, 0.5)',
          }}
        />
      </>
    );
  }
  
  return null;
};

export default Cursor;