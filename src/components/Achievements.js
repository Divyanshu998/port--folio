import React from 'react';
import { motion } from 'framer-motion';

const Achievements = () => {
  const achievements = [
    {
      title: '2X National Hackathon Winner',
      description: 'Won first place in two consecutive national-level hackathons, demonstrating exceptional problem-solving skills and innovative thinking under pressure.',
      year: '2022',
      icon: '🏆',
    },
    {
      title: 'Secretary of Coding Club at TIT College Bhopal',
      description: 'Led the college coding club, organizing workshops, coding competitions, and mentoring junior students in various programming languages and technologies.',
      year: '2021',
      icon: '👨‍💻',
    },
    {
      title: 'Certified Ethical Hacker',
      description: 'Earned the prestigious CEH certification, validating expertise in ethical hacking methodologies, tools, and techniques for identifying and addressing security vulnerabilities.',
      year: '2021',
      icon: '🔐',
    },
    {
      title: 'Published Research Paper on AI Security',
      description: 'Co-authored a research paper on securing AI systems against adversarial attacks, published in a peer-reviewed international journal.',
      year: '2020',
      icon: '📝',
    },
    {
      title: 'Top Bug Bounty Hunter',
      description: 'Ranked among the top 100 bug bounty hunters on a major platform, discovering and responsibly disclosing critical security vulnerabilities in various web applications.',
      year: '2020',
      icon: '🐛',
    },
  ];

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

  const badgeVariants = {
    hidden: { scale: 0, rotate: -10 },
    visible: i => ({ 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
        delay: i * 0.1
      } 
    }),
    hover: { 
      scale: 1.05,
      rotate: 5,
      boxShadow: '0 10px 25px -10px rgba(100, 255, 218, 0.4)',
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };

  return (
    <section id="achievements" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 cosmic-bg z-0"></div>
      <div className="absolute inset-0 grid-bg opacity-20 z-0"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.h2 variants={itemVariants} className="section-heading">
            <span className="text-accent font-mono mr-2">04.</span> Achievements
          </motion.h2>
          
          {/* Achievement Badges for mobile */}
          <div className="md:hidden grid grid-cols-1 gap-6 mb-10">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={badgeVariants}
                whileHover="hover"
                className="bg-secondary rounded-lg p-6 border border-accent/20 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-2xl mr-4 border border-accent/30">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-textLight">{achievement.title}</h3>
                    <p className="text-accent font-mono">{achievement.year}</p>
                  </div>
                </div>
                <p className="text-text">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Timeline for desktop */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Timeline line */}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-accent/30 h-full"
              ></motion.div>
              
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`flex items-center mb-20 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                      delay: 0.2
                    }}
                    className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-accent rounded-full border-4 border-primary z-10"
                  ></motion.div>
                  
                  {/* Year bubble */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className={`absolute left-1/2 transform ${
                      index % 2 === 0 ? 'translate-x-8' : '-translate-x-16'
                    } bg-accent text-primary font-bold rounded-full px-3 py-1 text-sm`}
                  >
                    {achievement.year}
                  </motion.div>
                  
                  {/* Content */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className={`w-5/12 ${
                      index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'
                    }`}
                  >
                    <div className="bg-secondary rounded-lg p-6 border border-accent/20 shadow-lg">
                      <div className="flex items-center mb-4 justify-center">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-2xl border border-accent/30">
                          {achievement.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-textLight mb-3">{achievement.title}</h3>
                      <p className="text-text">{achievement.description}</p>
                    </div>
                  </motion.div>
                  
                  {/* Empty space for the other side */}
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Call to action */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="btn-primary inline-block"
            >
              Let's work together
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;