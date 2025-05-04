import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import NebulaSplash from './components/NebulaSplash';
import SmoothScroll from './components/SmoothScroll';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);

  // Handle loading complete
  const handleLoadingComplete = () => {
    setLoading(false);
  };

  // Smooth scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.nav-item');
      
      if (sections.length === 0 || navLinks.length === 0) return;
      
      let current = '';
      
      sections.forEach((section) => {
        if (!section.id) return;
        
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        // Improved calculation for determining active section
        // This creates a more accurate highlight as you scroll
        if (window.scrollY >= sectionTop - 150 && 
            window.scrollY < sectionTop + sectionHeight - 150) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach((link) => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.substring(1) === current) {
          link.classList.add('active');
        }
      });
    };
    
    // Run once on initial load
    setTimeout(handleScroll, 100);
    
    // Use a throttled version of the scroll handler for better performance
    let scrollTimeout;
    const throttledScrollHandler = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null;
        }, 10); // Small delay for smoother performance
      }
    };
    
    window.addEventListener('scroll', throttledScrollHandler);
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);
  
  return (
    <ParallaxProvider>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingScreen onLoadingComplete={handleLoadingComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="App cosmic-bg min-h-screen"
          >
            <NebulaSplash />
            <Cursor />
            <Navbar />
            
            <SmoothScroll>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Achievements />
                <Experience />
                <Contact />
                <Footer />
              </motion.div>
            </SmoothScroll>
          </motion.div>
        )}
      </AnimatePresence>
    </ParallaxProvider>
  );
}

export default App;