import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ThreeContact from './ThreeContact';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [focused, setFocused] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFocus = (name) => {
    setFocused((prev) => ({ ...prev, [name]: true }));
  };
  
  const handleBlur = (name) => {
    if (!formState[name]) {
      setFocused((prev) => ({ ...prev, [name]: false }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormState({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setFocused({
          name: false,
          email: false,
          subject: false,
          message: false,
        });
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };
  
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
  
  const socialLinks = [
    {
      name: 'GitHub',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      url: 'https://github.com/Divyanshu998',
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      url: 'https://linkedin.com/in/divyanshu-shinde',
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      url: 'https://twitter.com/DivyanshuS38067',
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      url: 'https://www.instagram.com/divyanshu_shinde.35?igsh=MmJhZGN0cDdrYzV6',
    },
  ];
  
  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Three.js Contact Animation */}
      <ThreeContact />
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-darkBlue z-0"></div>
      <div className="absolute inset-0 grid-bg opacity-20 z-0"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.h2 variants={itemVariants} className="section-heading">
            <span className="text-accent font-mono mr-2">06.</span> Get In Touch
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-textLight mb-6">Let's Connect</h3>
              <p className="text-lg mb-8">
                I'm currently open to new opportunities and collaborations. Whether you have a question, a project idea, or just want to say hello, feel free to reach out!
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <a href="mailto:divyanshushinde103@gmail.com" className="text-accent hover:underline">
                    divyanshushinde103@gmail.com
                  </a>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <span>Bhopal, India</span>
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-textLight mb-4">Find me on</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ 
                      scale: 1.1,
                      color: '#64ffda',
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-text hover:text-accent transition-colors duration-300 border border-accent/20"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="bg-secondary rounded-lg p-6 border border-accent/20 shadow-lg">
                <h3 className="text-2xl font-bold text-textLight mb-6">Send a Message</h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="relative">
                      <motion.input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        onFocus={() => handleFocus('name')}
                        onBlur={() => handleBlur('name')}
                        required
                        className="w-full bg-primary border border-accent/30 rounded-lg px-4 py-3 text-textLight focus:outline-none focus:border-accent transition-all duration-300"
                        animate={{ 
                          y: focused.name ? 0 : 5,
                          opacity: focused.name ? 1 : 0.8
                        }}
                      />
                      <motion.label
                        htmlFor="name"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                          focused.name
                            ? 'text-xs -top-2 text-accent bg-secondary px-1'
                            : 'text-text top-3'
                        }`}
                      >
                        Your Name
                      </motion.label>
                    </div>
                    
                    <div className="relative">
                      <motion.input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        required
                        className="w-full bg-primary border border-accent/30 rounded-lg px-4 py-3 text-textLight focus:outline-none focus:border-accent transition-all duration-300"
                        animate={{ 
                          y: focused.email ? 0 : 5,
                          opacity: focused.email ? 1 : 0.8
                        }}
                      />
                      <motion.label
                        htmlFor="email"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                          focused.email
                            ? 'text-xs -top-2 text-accent bg-secondary px-1'
                            : 'text-text top-3'
                        }`}
                      >
                        Your Email
                      </motion.label>
                    </div>
                    
                    <div className="relative">
                      <motion.input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        onFocus={() => handleFocus('subject')}
                        onBlur={() => handleBlur('subject')}
                        required
                        className="w-full bg-primary border border-accent/30 rounded-lg px-4 py-3 text-textLight focus:outline-none focus:border-accent transition-all duration-300"
                        animate={{ 
                          y: focused.subject ? 0 : 5,
                          opacity: focused.subject ? 1 : 0.8
                        }}
                      />
                      <motion.label
                        htmlFor="subject"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                          focused.subject
                            ? 'text-xs -top-2 text-accent bg-secondary px-1'
                            : 'text-text top-3'
                        }`}
                      >
                        Subject
                      </motion.label>
                    </div>
                    
                    <div className="relative">
                      <motion.textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        onFocus={() => handleFocus('message')}
                        onBlur={() => handleBlur('message')}
                        required
                        rows="4"
                        className="w-full bg-primary border border-accent/30 rounded-lg px-4 py-3 text-textLight focus:outline-none focus:border-accent transition-all duration-300"
                        animate={{ 
                          y: focused.message ? 0 : 5,
                          opacity: focused.message ? 1 : 0.8
                        }}
                      ></motion.textarea>
                      <motion.label
                        htmlFor="message"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                          focused.message
                            ? 'text-xs -top-2 text-accent bg-secondary px-1'
                            : 'text-text top-3'
                        }`}
                      >
                        Your Message
                      </motion.label>
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || submitSuccess}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                        isSubmitting
                          ? 'bg-accent/50 text-primary cursor-wait'
                          : submitSuccess
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-accent text-primary hover:bg-accent/90'
                      }`}
                    >
                      {isSubmitting ? 'Sending...' : submitSuccess ? 'Message Sent!' : 'Send Message'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;