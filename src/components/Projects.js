import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeProjects from './ThreeProjects';

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);

  const projects = [
    {
      title: 'AI-Powered Cybersecurity Suite',
      description: 'A comprehensive security solution that uses machine learning to detect and prevent cyber threats in real-time. Features include anomaly detection, threat intelligence, and automated incident response.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      tech: ['Python', 'TensorFlow', 'Django', 'React', 'AWS'],
      link: '#',
      github: '#',
    },
    {
      title: 'Blockchain-Based Supply Chain',
      description: 'A decentralized application for tracking products through the supply chain using blockchain technology. Ensures transparency, reduces fraud, and improves efficiency in logistics operations.',
      image: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80',
      tech: ['Solidity', 'Ethereum', 'Web3.js', 'React', 'Node.js'],
      link: '#',
      github: '#',
    },
    {
      title: 'Algorithmic Trading Platform',
      description: 'An automated trading system for forex and cryptocurrency markets. Implements various trading strategies with real-time data analysis and risk management features.',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      tech: ['Python', 'Pandas', 'Flask', 'WebSockets', 'MongoDB'],
      link: '#',
      github: '#',
    },
    {
      title: 'Smart Home Security System',
      description: 'IoT-based home security solution with facial recognition, motion detection, and remote monitoring capabilities. Includes mobile app for alerts and video streaming.',
      image: 'https://images.unsplash.com/photo-1558002038-bb0237f4b3af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      tech: ['Raspberry Pi', 'OpenCV', 'TensorFlow', 'React Native', 'Firebase'],
      link: '#',
      github: '#',
    },
    {
      title: 'NLP-Based Content Analyzer',
      description: 'A tool that uses natural language processing to analyze text content for sentiment, topic classification, and readability. Helps content creators optimize their writing for target audiences.',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
      tech: ['Python', 'NLTK', 'spaCy', 'Flask', 'Vue.js'],
      link: '#',
      github: '#',
    },
    {
      title: 'Decentralized Finance Dashboard',
      description: 'A comprehensive dashboard for monitoring and managing DeFi investments across multiple protocols. Features portfolio tracking, yield farming analytics, and risk assessment tools.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      tech: ['React', 'Web3.js', 'GraphQL', 'Ethers.js', 'TailwindCSS'],
      link: '#',
      github: '#',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: { 
      y: -10,
      boxShadow: '0 10px 30px -15px rgba(100, 255, 218, 0.3)',
      transition: { duration: 0.3 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: [0.19, 1.0, 0.22, 1.0]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.3,
        ease: [0.19, 1.0, 0.22, 1.0]
      }
    }
  };

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      {/* Three.js Projects Animation */}
      <ThreeProjects />
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-darkBlue to-primary z-0"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.h2 variants={itemVariants} className="section-heading">
            <span className="text-accent font-mono mr-2">03.</span> Projects
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-secondary rounded-lg overflow-hidden border border-accent/20 shadow-lg cursor-pointer h-full"
                onClick={() => setActiveProject(project)}
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-neonBlue/20 z-10"></div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-textLight mb-2">{project.title}</h3>
                  <p className="text-text mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-1 bg-primary text-xs rounded-full border border-accent/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <motion.a
                      href={project.github}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-accent hover:text-accent/80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </motion.a>
                    <motion.a
                      href={project.link}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-accent hover:text-accent/80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Project modal */}
          <AnimatePresence>
            {activeProject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setActiveProject(null)}
              >
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-secondary max-w-4xl w-full rounded-lg overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative h-64 md:h-80">
                    <img 
                      src={activeProject.image} 
                      alt={activeProject.title} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center text-accent hover:bg-primary transition-colors duration-300"
                      onClick={() => setActiveProject(null)}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-textLight mb-4">{activeProject.title}</h3>
                    <p className="text-text mb-6">{activeProject.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-textLight mb-2">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.tech.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-3 py-1 bg-primary text-sm rounded-full border border-accent/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <a
                        href={activeProject.github}
                        className="btn-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Code
                      </a>
                      <a
                        href={activeProject.link}
                        className="px-6 py-3 bg-accent text-primary rounded hover:bg-accent/90 transition-all duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live Demo
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center"
            >
              <span>View More on GitHub</span>
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;