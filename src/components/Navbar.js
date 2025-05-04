import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-scroll';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', to: 'hero' },
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'skills' },
    { name: 'Projects', to: 'projects' },
    { name: 'Achievements', to: 'achievements' },
    { name: 'Experience', to: 'experience' },
    { name: 'Contact', to: 'contact' },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        when: 'beforeChildren',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: 'afterChildren',
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        when: 'beforeChildren',
      },
    },
  };

  return (
    <motion.nav
      className={`fixed w-full z-50 py-4 px-6 md:px-12 transition-all duration-300 ${
        scrolled ? 'bg-primary/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div
          className="text-2xl font-bold text-accent"
          variants={itemVariants}
        >
          <span className="font-mono">DS.</span>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.ul
          className="hidden md:flex space-x-8"
          variants={navVariants}
        >
          {navLinks.map((link, index) => (
            <motion.li key={index} variants={itemVariants}>
              <Link
                to={link.to}
                spy={true}
                smooth={true}
                offset={-100}
                duration={800}
                className="nav-link nav-item cursor-pointer font-mono text-sm"
              >
                <span className="text-accent mr-1">0{index + 1}.</span> {link.name}
              </Link>
            </motion.li>
          ))}
          <motion.li variants={itemVariants}>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary font-mono text-sm"
            >
              Resume
            </a>
          </motion.li>
        </motion.ul>

        {/* Mobile Menu Button */}
        <motion.div
          className="md:hidden z-50"
          variants={itemVariants}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-8 h-6 flex flex-col justify-between items-end cursor-pointer">
            <motion.span
              className={`h-0.5 bg-accent transition-all duration-300 ${
                isOpen ? 'w-8 transform rotate-45 translate-y-2.5' : 'w-8'
              }`}
            ></motion.span>
            <motion.span
              className={`h-0.5 bg-accent transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'w-6'
              }`}
            ></motion.span>
            <motion.span
              className={`h-0.5 bg-accent transition-all duration-300 ${
                isOpen ? 'w-8 transform -rotate-45 -translate-y-2.5' : 'w-4'
              }`}
            ></motion.span>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed top-0 right-0 h-screen w-3/4 bg-secondary/95 backdrop-blur-md shadow-xl md:hidden flex flex-col justify-center items-center"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <motion.ul className="flex flex-col space-y-6 items-center">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link
                      to={link.to}
                      spy={true}
                      smooth={true}
                      offset={-100}
                      duration={800}
                      className="nav-link nav-item text-lg font-mono"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-accent mr-2">0{index + 1}.</span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
                <motion.li variants={itemVariants} whileHover={{ scale: 1.05 }}>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary font-mono mt-4"
                  >
                    Resume
                  </a>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;