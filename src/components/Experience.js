import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Experience = () => {
  const [activeTab, setActiveTab] = useState(0);

  const experiences = [
    {
      title: 'CTO',
      company: 'Incubator Pool',
      period: 'Jan 2022 - Present',
      description: [
        'Lead the technical strategy and vision for the company, overseeing all technology-related decisions and initiatives.',
        'Manage a team of 15+ developers, data scientists, and security specialists across multiple projects.',
        'Implemented CI/CD pipelines and DevOps practices, reducing deployment time by 70% and improving code quality.',
        'Architected scalable cloud infrastructure on AWS, handling millions of requests per day with 99.9% uptime.',
        'Established security protocols and compliance standards, ensuring protection of sensitive user data and intellectual property.',
      ],
      technologies: ['AWS', 'Kubernetes', 'Python', 'React', 'TensorFlow', 'Blockchain'],
    },
    {
      title: 'Lead Security Engineer',
      company: 'CyberShield Solutions',
      period: 'Mar 2020 - Dec 2021',
      description: [
        'Led security assessments and penetration testing for enterprise clients, identifying and remediating critical vulnerabilities.',
        'Developed automated security scanning tools that reduced manual testing time by 60%.',
        'Implemented zero-trust architecture for a financial services client, enhancing their security posture against sophisticated threats.',
        'Conducted security training sessions for development teams, fostering a security-first mindset across the organization.',
        'Collaborated with product teams to integrate security into the SDLC, ensuring security was addressed from the design phase.',
      ],
      technologies: ['Penetration Testing', 'SIEM', 'Python', 'Network Security', 'Cloud Security'],
    },
    {
      title: 'AI Research Developer',
      company: 'InnovateAI Labs',
      period: 'Jun 2019 - Feb 2020',
      description: [
        'Researched and developed machine learning models for natural language processing and computer vision applications.',
        'Created a sentiment analysis system with 92% accuracy for a major e-commerce platform.',
        'Optimized deep learning models for edge devices, reducing inference time by 40% while maintaining accuracy.',
        'Collaborated with academic researchers to publish a paper on adversarial attacks against AI systems.',
        'Developed and maintained data pipelines for processing and analyzing large datasets.',
      ],
      technologies: ['TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Data Science'],
    },
    {
      title: 'Full Stack Developer',
      company: 'WebTech Innovations',
      period: 'Aug 2018 - May 2019',
      description: [
        'Developed responsive web applications using React, Node.js, and MongoDB.',
        'Implemented RESTful APIs and GraphQL endpoints for mobile and web clients.',
        'Optimized database queries and application performance, reducing page load times by 35%.',
        'Collaborated with UX/UI designers to implement intuitive user interfaces and smooth interactions.',
        'Participated in agile development processes, including daily stand-ups, sprint planning, and retrospectives.',
      ],
      technologies: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'GraphQL', 'AWS'],
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

  const tabVariants = {
    inactive: { opacity: 0.7, y: 0 },
    active: { 
      opacity: 1, 
      y: 0,
      color: '#64ffda',
      transition: { duration: 0.3 }
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <section id="experience" className="py-20 relative overflow-hidden bg-primary">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-20 z-0"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.h2 variants={itemVariants} className="section-heading">
            <span className="text-accent font-mono mr-2">05.</span> Experience
          </motion.h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Tabs - Vertical for desktop, horizontal for mobile */}
            <motion.div 
              variants={itemVariants}
              className="md:w-1/4 overflow-x-auto md:overflow-x-visible"
            >
              <div className="flex md:flex-col border-b md:border-b-0 md:border-l border-accent/30">
                {experiences.map((experience, index) => (
                  <motion.button
                    key={index}
                    variants={tabVariants}
                    animate={activeTab === index ? 'active' : 'inactive'}
                    whileHover={{ x: 3 }}
                    className={`px-4 py-3 text-left whitespace-nowrap md:whitespace-normal font-mono text-sm md:text-base transition-all duration-300 relative ${
                      activeTab === index
                        ? 'text-accent'
                        : 'text-text hover:text-textLight'
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    <span className="relative z-10">{experience.company}</span>
                    {activeTab === index && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 md:bottom-auto md:left-0 h-0.5 md:h-full md:w-0.5 bg-accent w-full"
                      ></motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
            
            {/* Content */}
            <motion.div 
              variants={itemVariants}
              className="md:w-3/4"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-secondary rounded-lg p-6 border border-accent/20 shadow-lg"
                >
                  <h3 className="text-2xl font-bold text-textLight mb-1">
                    {experiences[activeTab].title}{' '}
                    <span className="text-accent">@ {experiences[activeTab].company}</span>
                  </h3>
                  
                  <p className="font-mono text-text mb-6">{experiences[activeTab].period}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {experiences[activeTab].description.map((point, index) => (
                      <li key={index} className="flex">
                        <span className="text-accent mr-2">▹</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {experiences[activeTab].technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary rounded-full text-sm border border-accent/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* Resume download */}
          <motion.div
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center"
            >
              <span>View Full Resume</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;