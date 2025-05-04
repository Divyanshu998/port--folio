import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showName, setShowName] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const robotRef = useRef(null);
  const headControls = useAnimation();
  const leftArmControls = useAnimation();
  const rightArmControls = useAnimation();
  
  // Animation variants for text reveal - minimalistic
  const nameVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };
  
  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 10
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "tween",
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  // Robot animation variants
  const robotVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  // Robot head animation - more subtle and natural
  const headVariants = {
    animate: {
      rotateZ: [0, -3, 3, -3, 0],
      y: [0, -2, 0, -2, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    },
    lookAt: (position) => {
      // Calculate angle to look at cursor
      if (!robotRef.current) return {};
      
      const robotRect = robotRef.current.getBoundingClientRect();
      const robotCenterX = robotRect.left + robotRect.width / 2;
      const robotCenterY = robotRect.top + robotRect.height / 3; // Focus on head area
      
      // Calculate angle (limited range)
      const deltaX = position.x - robotCenterX;
      const deltaY = position.y - robotCenterY;
      const angleX = Math.min(Math.max(deltaX / 100, -10), 10);
      const angleY = Math.min(Math.max(deltaY / 100, -5), 5);
      
      return {
        rotateZ: angleX,
        rotateX: -angleY,
        transition: { type: "spring", stiffness: 150, damping: 15 }
      };
    }
  };
  
  // Robot antenna animation - more lively
  const antennaVariants = {
    animate: {
      scaleY: [1, 1.2, 1, 1.1, 1],
      rotateZ: [0, 2, -2, 2, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut"
      }
    }
  };
  
  // Robot eye animation - blinking effect
  const eyeVariants = {
    animate: {
      scaleY: [1, 1, 0.1, 1, 1],
      opacity: [1, 1, 0.8, 1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "mirror",
        times: [0, 0.4, 0.5, 0.6, 1],
        ease: "easeInOut"
      }
    }
  };
  
  // Robot arm animation - more enthusiastic wave
  const armVariants = {
    animate: {
      rotateZ: [0, 10, 5, 15, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "mirror",
        ease: [0.45, 0, 0.55, 1]
      }
    },
    wave: {
      rotateZ: [0, 50, -5, 55, -10, 60, 0],
      transition: {
        duration: 1.2,
        times: [0, 0.2, 0.3, 0.5, 0.6, 0.8, 1],
        ease: "easeInOut"
      }
    }
  };
  
  // Speech bubble animation
  const speechBubbleVariants = {
    hidden: { opacity: 0, scale: 0, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0, 
      transition: { duration: 0.2 } 
    }
  };
  
  // Track cursor position for robot to follow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Update robot head to follow cursor
  useEffect(() => {
    // Only update if component is mounted
    if (robotRef.current) {
      const lookAtAnimation = headVariants.lookAt(cursorPosition);
      headControls.start(lookAtAnimation);
    }
  }, [cursorPosition, headControls, headVariants]);
  
  // Show greeting and wave animation - improved timing
  useEffect(() => {
    // Make sure component is mounted before starting animations
    let isMounted = true;
    let timeoutIds = [];
    
    const addTimeout = (callback, delay) => {
      const id = setTimeout(() => {
        if (isMounted) callback();
      }, delay);
      timeoutIds.push(id);
      return id;
    };
    
    // Initialize arm animations
    addTimeout(() => {
      leftArmControls.start(armVariants.animate);
      rightArmControls.start(armVariants.animate);
    }, 100);
    
    // First greeting
    addTimeout(() => {
      setShowGreeting(true);
      
      // Wave animation - more enthusiastic
      addTimeout(() => {
        rightArmControls.start(armVariants.wave).then(() => {
          if (isMounted) {
            addTimeout(() => {
              rightArmControls.start(armVariants.animate);
            }, 300);
          }
        });
      }, 100);
      
      // Hide first greeting
      addTimeout(() => {
        setShowGreeting(false);
        
        // Second greeting after a pause
        addTimeout(() => {
          setShowGreeting(true);
          
          // Wave again
          addTimeout(() => {
            rightArmControls.start(armVariants.wave).then(() => {
              if (isMounted) {
                rightArmControls.start(armVariants.animate);
              }
            });
          }, 100);
          
          // Hide second greeting
          addTimeout(() => {
            setShowGreeting(false);
          }, 2500);
        }, 5000);
      }, 3500);
    }, 800);
    
    return () => {
      isMounted = false;
      timeoutIds.forEach(clearTimeout);
    };
  }, [rightArmControls, leftArmControls]);
  
  // Loading progress simulation - smoother transition
  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        // Slower, more controlled progress
        const newProgress = prev + (prev < 50 ? 1.5 : 0.8);
        
        if (newProgress >= 100) {
          clearInterval(loadingInterval);
          setShowName(true);
          
          // Complete loading after name animation with longer delay
          // This ensures the particle animation is visible when transitioning
          setTimeout(() => {
            // Fade out transition
            const loadingElement = document.querySelector('.loading-screen');
            if (loadingElement) {
              loadingElement.classList.add('fade-out');
            }
            
            // Delay the actual completion to allow for smooth transition
            setTimeout(() => {
              if (onLoadingComplete) {
                onLoadingComplete();
              }
            }, 800); // Transition duration
          }, 3000); // Longer viewing time for name and particles
          
          return 100;
        }
        
        return newProgress;
      });
    }, 60); // Slightly slower updates
    
    return () => {
      clearInterval(loadingInterval);
    };
  }, [onLoadingComplete]);
  
  return (
    <div className="loading-screen fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary transition-opacity duration-800">
      {/* Robot Animation */}
      <motion.div
        className="mb-8 relative"
        variants={robotVariants}
        initial="hidden"
        animate="visible"
        ref={robotRef}
      >
        {/* Speech Bubble - improved with AnimatePresence */}
        <AnimatePresence>
          {showGreeting && (
            <motion.div 
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-secondary px-5 py-3 rounded-lg border-2 border-accent shadow-lg shadow-accent/20"
              variants={speechBubbleVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="speech-bubble"
            >
              <p className="text-accent text-base md:text-lg font-mono font-bold tracking-wide">HI!</p>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-4 h-4 bg-secondary border-r-2 border-b-2 border-accent"></div>
            </motion.div>
          )}
        </AnimatePresence>}
        
        <div className="relative w-32 h-40 md:w-40 md:h-48">
          {/* Robot Head */}
          <motion.div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 bg-secondary rounded-lg border-2 border-accent"
            variants={headVariants}
            animate={headControls}
            style={{ transformOrigin: "center bottom" }}
          >
            {/* Antenna */}
            <motion.div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-1 h-4 md:h-5 bg-accent rounded-full origin-bottom"
              variants={antennaVariants}
              animate="animate"
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-2 h-2 bg-accent rounded-full" />
            </motion.div>
            
            {/* Face Plate - improved design */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-14 md:w-20 md:h-16 bg-secondary border-2 border-accent/40 rounded-lg"></div>
            
            {/* Eyes - more expressive */}
            <div className="absolute top-5 md:top-6 left-0 right-0 flex justify-center space-x-5 md:space-x-6">
              <motion.div 
                className="w-3.5 h-4 md:w-4.5 md:h-5 rounded-full bg-accent opacity-90"
                variants={eyeVariants}
                animate="animate"
              />
              <motion.div 
                className="w-3.5 h-4 md:w-4.5 md:h-5 rounded-full bg-accent opacity-90"
                variants={eyeVariants}
                animate="animate"
                transition={{ delay: 0.5 }}
              />
            </div>
            
            {/* Mouth - happy expression */}
            <div className="absolute bottom-4 md:bottom-5 left-1/2 transform -translate-x-1/2 w-10 md:w-12">
              <div className="h-0.5 bg-accent rounded-full"></div>
              <div className="h-3 w-full rounded-b-lg overflow-hidden flex justify-center items-end">
                <div className="w-6 md:w-8 h-3 md:h-4 rounded-t-full bg-accent/20 border-t border-accent"></div>
              </div>
            </div>
          </motion.div>
          
          {/* Robot Body */}
          <div className="absolute top-20 md:top-24 left-1/2 transform -translate-x-1/2 w-24 h-16 md:w-28 md:h-20 bg-secondary rounded-lg border-2 border-accent">
            {/* Body Details */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-14 h-5 bg-secondary border border-accent/50 rounded-md flex items-center justify-center">
              <div className="w-10 h-1 bg-accent/70 rounded-full" />
            </div>
            
            {/* Center Power Core */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-2 border-accent flex items-center justify-center overflow-hidden">
              <div className="absolute w-full h-full bg-accent/10" />
              <div className="relative w-5 h-5 bg-accent rounded-full animate-pulse" />
            </div>
          </div>
          
          {/* Robot Arms */}
          <motion.div 
            className="absolute top-24 md:top-28 left-0 w-5 h-12 md:h-14 bg-secondary rounded-full border-2 border-accent origin-top"
            variants={armVariants}
            animate={leftArmControls}
          >
            {/* Hand */}
            <div className="absolute -left-1 bottom-0 w-7 h-4 bg-secondary rounded-full border-2 border-accent"></div>
          </motion.div>
          
          <motion.div 
            className="absolute top-24 md:top-28 right-0 w-5 h-12 md:h-14 bg-secondary rounded-full border-2 border-accent origin-top"
            variants={armVariants}
            animate={rightArmControls}
            style={{ transformOrigin: "top center" }}
          >
            {/* Hand */}
            <div className="absolute -right-1 bottom-0 w-7 h-4 bg-secondary rounded-full border-2 border-accent"></div>
          </motion.div>
          
          {/* Robot Legs */}
          <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 w-6 h-10 bg-secondary rounded-b-lg border-2 border-accent">
            {/* Foot */}
            <div className="absolute -left-1 bottom-0 w-8 h-2 bg-secondary rounded-b-lg border-2 border-accent"></div>
          </div>
          
          <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 w-6 h-10 bg-secondary rounded-b-lg border-2 border-accent">
            {/* Foot */}
            <div className="absolute -right-1 bottom-0 w-8 h-2 bg-secondary rounded-b-lg border-2 border-accent"></div>
          </div>
        </div>
      </motion.div>
      
      {/* Name Animation */}
      {showName && (
        <motion.div 
          className="relative z-10 text-center"
          variants={nameVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-4xl md:text-6xl font-medium text-textLight mb-3 font-mono tracking-wider">
            {Array.from("Divyanshu").map((letter, index) => (
              <motion.span key={`first-${index}`} variants={letterVariants} className="inline-block">
                {letter}
              </motion.span>
            ))}
            <br />
            {Array.from("Shinde").map((letter, index) => (
              <motion.span key={`last-${index}`} variants={letterVariants} className="inline-block">
                {letter}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="h-px bg-accent mx-auto opacity-70"
            style={{ maxWidth: "200px" }}
          />
        </motion.div>
      )}
      
      {/* Loading Progress Bar */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="w-48 h-px bg-secondary rounded-none overflow-hidden opacity-50">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;