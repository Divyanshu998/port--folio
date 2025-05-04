import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { gsap } from 'gsap';
import ThreeHero from './ThreeHero';

const Hero = () => {
  useEffect(() => {
    // Create a starry background effect
    const createStars = () => {
      const starsContainer = document.querySelector('.stars-container');
      if (!starsContainer) return;
      
      // Clear existing stars
      starsContainer.innerHTML = '';
      
      const count = Math.min(window.innerWidth / 3, 200);
      
      for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Random size
        const size = Math.random() * 2;
        
        // Random opacity
        const opacity = Math.random() * 0.8 + 0.2;
        
        // Apply styles
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.opacity = opacity.toString();
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        starsContainer.appendChild(star);
      }
    };
    
    createStars();
    window.addEventListener('resize', createStars);
    
    // GSAP animation for the grid background
    gsap.to('.grid-bg', {
      backgroundPosition: '1000px 500px',
      duration: 200,
      repeat: -1,
      ease: 'linear'
    });
    
    return () => {
      window.removeEventListener('resize', createStars);
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Three.js Hero Animation */}
      <ThreeHero />
      
      {/* Stars background */}
      <div className="stars-container absolute inset-0 z-0"></div>
      
      {/* Grid background */}
      <div className="grid-bg absolute inset-0 z-0 opacity-30"></div>
      
      <div className="container mx-auto px-6 md:px-12 z-10 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-mono text-accent mb-5"
        >
          Hi, my name is
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold text-textLight mb-4"
        >
          Divyanshu Shinde.
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-text mb-6"
        >
          I build things for the digital world.
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-xl md:text-2xl text-text max-w-2xl mb-12"
        >
          <span className="text-accent font-semibold">CTO at Incubator Pool</span> | AI & Cybersecurity Enthusiast | 2X National Hackathon Winner
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            to="projects"
            spy={true}
            smooth={true}
            offset={-100}
            duration={800}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg font-mono"
            >
              Check out my work
            </motion.button>
          </Link>
          
          <Link
            to="contact"
            spy={true}
            smooth={true}
            offset={-100}
            duration={800}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 border border-neonPurple text-neonPurple rounded hover:bg-neonPurple/10 transition-all duration-300 text-lg font-mono"
            >
              Get in touch
            </motion.button>
          </Link>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-accent text-sm font-mono mb-2">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-accent rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-3 bg-accent rounded-full mt-2"
          ></motion.div>
        </motion.div>
      </motion.div>
      
      {/* Custom CSS for stars */}
      <style jsx="true">{`
        .star {
          position: absolute;
          background-color: #fff;
          border-radius: 50%;
          animation: twinkle 5s infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default Hero;