import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
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

  const skills = [
    {
      category: 'Programming',
      items: [
        { name: 'Python', level: 95 },
        { name: 'JavaScript', level: 85 },
        { name: 'Solidity', level: 80 },
        { name: 'C++', level: 75 },
      ],
    },
    {
      category: 'Web Development',
      items: [
        { name: 'Django', level: 90 },
        { name: 'Flask', level: 85 },
        { name: 'React', level: 80 },
        { name: 'Node.js', level: 75 },
      ],
    },
    {
      category: 'AI & Data Science',
      items: [
        { name: 'TensorFlow', level: 85 },
        { name: 'PyTorch', level: 80 },
        { name: 'Data Analysis', level: 90 },
        { name: 'NLP', level: 75 },
      ],
    },
    {
      category: 'Cybersecurity',
      items: [
        { name: 'Penetration Testing', level: 90 },
        { name: 'Network Security', level: 85 },
        { name: 'Cloud Security', level: 80 },
        { name: 'Cryptography', level: 75 },
      ],
    },
  ];

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
        delay: 0.1
      } 
    },
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };

  const barVariants = {
    hidden: { width: 0 },
    visible: level => ({ 
      width: `${level}%`,
      transition: { 
        duration: 1,
        ease: [0.165, 0.84, 0.44, 1]
      } 
    })
  };

  // Icons for each category (simplified ASCII art for demonstration)
  const categoryIcons = {
    'Programming': '🧑‍💻',
    'Web Development': '🌐',
    'AI & Data Science': '🤖',
    'Cybersecurity': '🔒'
  };

  return (
    <section id="skills" className="py-20 relative overflow-hidden bg-primary">
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
            <span className="text-accent font-mono mr-2">02.</span> Skills
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {skills.map((skillCategory, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                variants={itemVariants}
                className="bg-secondary rounded-lg p-6 border border-accent/20 shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <motion.div
                    variants={iconVariants}
                    whileHover="hover"
                    className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-2xl mr-4 border border-accent/30"
                  >
                    {categoryIcons[skillCategory.category]}
                  </motion.div>
                  <h3 className="text-xl font-bold text-textLight">{skillCategory.category}</h3>
                </div>
                
                <div className="space-y-4">
                  {skillCategory.items.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between mb-1">
                        <span className="text-textLight">{skill.name}</span>
                        <span className="text-accent font-mono">{skill.level}%</span>
                      </div>
                      <div className="w-full h-2 bg-primary rounded-full overflow-hidden">
                        <motion.div
                          custom={skill.level}
                          variants={barVariants}
                          className="h-full rounded-full bg-gradient-to-r from-accent to-neonPurple"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Additional skills section */}
          <motion.div
            variants={itemVariants}
            className="mt-12 bg-secondary rounded-lg p-6 border border-accent/20 shadow-lg"
          >
            <h3 className="text-xl font-bold text-textLight mb-6">Other Technologies & Tools</h3>
            <div className="flex flex-wrap gap-3">
              {[
                'AWS', 'Docker', 'Kubernetes', 'Git', 'CI/CD', 'GraphQL', 
                'MongoDB', 'PostgreSQL', 'Redis', 'Blockchain', 'Smart Contracts',
                'Machine Learning', 'Data Visualization', 'REST APIs', 'Linux',
                'Bash Scripting', 'Agile', 'DevOps', 'Microservices'
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: index * 0.05 } 
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: 'rgba(100, 255, 218, 0.2)',
                    borderColor: 'rgba(100, 255, 218, 0.5)'
                  }}
                  viewport={{ once: true }}
                  className="px-4 py-2 bg-primary rounded-lg border border-accent/20 transition-all duration-300"
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;