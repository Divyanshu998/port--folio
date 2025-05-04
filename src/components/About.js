import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import ThreeAbout from './ThreeAbout';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Three.js About Animation */}
      <ThreeAbout />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-darkBlue z-0"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 variants={itemVariants} className="section-heading">
            <span className="text-accent font-mono mr-2">01.</span> About Me
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div variants={itemVariants} className="text-lg">
              <p className="mb-4">
                Hello! I'm Divyanshu, a passionate technologist and problem solver with a keen interest in AI, cybersecurity, and innovative solutions.
              </p>
              <p className="mb-4">
                Currently serving as the CTO at Incubator Pool, I lead technical initiatives and drive innovation across various projects. My journey in technology has been fueled by curiosity and a desire to create meaningful impact.
              </p>
              <p className="mb-4">
                I'm proud to have won national hackathons twice, where I demonstrated my ability to develop creative solutions under pressure. These experiences have shaped my approach to problem-solving and teamwork.
              </p>
              <p>
                When I'm not coding or exploring new technologies, you might find me analyzing forex markets or hunting for security vulnerabilities as part of bug bounty programs.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col justify-center">
              <div className="bg-secondary p-6 rounded-lg border border-accent/20 shadow-lg">
                <h3 className="text-xl font-bold text-textLight mb-4">I am a</h3>
                <div className="h-16 flex items-center">
                  <TypeAnimation
                    sequence={[
                      'Python Developer 🐍',
                      2000,
                      'Bug Bounty Hunter 🎯',
                      2000,
                      'Forex Trader 📈',
                      2000,
                      'AI Developer 🤖',
                      2000,
                    ]}
                    wrapper="span"
                    cursor={true}
                    repeat={Infinity}
                    className="text-2xl font-bold text-accent"
                  />
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-textLight mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'Django', 'Flask', 'Solidity', 'React', 'TensorFlow', 'AWS', 'Cybersecurity'].map((tech, index) => (
                      <motion.span
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        className="px-3 py-1 bg-primary rounded-full text-sm border border-accent/30"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;