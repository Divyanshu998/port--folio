import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeContact = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup - optimized for performance
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false,
      precision: 'lowp'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Add renderer to DOM
    const mountNode = mountRef.current;
    mountNode.appendChild(renderer.domElement);
    
    // Create particles for a network effect
    const createNetworkParticles = () => {
      const particlesGroup = new THREE.Group();
      scene.add(particlesGroup);
      
      // Create particles
      const particlesCount = 100;
      const particles = [];
      
      for (let i = 0; i < particlesCount; i++) {
        const geometry = new THREE.SphereGeometry(0.03, 8, 8);
        const material = new THREE.MeshBasicMaterial({
          color: 0x64ffda,
          transparent: true,
          opacity: 0.7
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Random position within a sphere
        const radius = 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
        particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
        particle.position.z = radius * Math.cos(phi);
        
        // Animation properties
        particle.userData = {
          originalX: particle.position.x,
          originalY: particle.position.y,
          originalZ: particle.position.z,
          speed: Math.random() * 0.01 + 0.005
        };
        
        particlesGroup.add(particle);
        particles.push(particle);
      }
      
      // Create connections between nearby particles
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x64ffda,
        transparent: true,
        opacity: 0.2
      });
      
      const connections = [];
      
      for (let i = 0; i < particles.length; i++) {
        const particleA = particles[i];
        
        for (let j = i + 1; j < particles.length; j++) {
          const particleB = particles[j];
          
          // Calculate distance between particles
          const distance = particleA.position.distanceTo(particleB.position);
          
          // Connect particles if they are close enough
          if (distance < 1.5) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              particleA.position,
              particleB.position
            ]);
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            line.userData = {
              particleA,
              particleB
            };
            
            particlesGroup.add(line);
            connections.push(line);
          }
        }
      }
      
      return { particlesGroup, particles, connections };
    };
    
    // Create network particles
    const { particlesGroup, particles, connections } = createNetworkParticles();
    
    // Create a central sphere representing the contact point
    const createCentralSphere = () => {
      const geometry = new THREE.SphereGeometry(0.3, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        transparent: true,
        opacity: 0.7
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      
      return sphere;
    };
    
    const centralSphere = createCentralSphere();
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Check if section is visible
    let isVisible = false;
    const contactSection = document.getElementById('contact');
    
    const checkVisibility = () => {
      if (!contactSection) return;
      
      const rect = contactSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if contact section is in viewport
      isVisible = rect.top < windowHeight && rect.bottom > 0;
    };
    
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Initial check
    
    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Only animate when visible
      if (isVisible) {
        // Rotate the entire network based on mouse position
        particlesGroup.rotation.y = mouseX * 0.3;
        particlesGroup.rotation.x = mouseY * 0.2;
        
        // Pulse the central sphere
        const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
        centralSphere.scale.set(scale, scale, scale);
        
        // Animate particles
        particles.forEach(particle => {
          if (particle.userData) {
            // Move particles in a wave pattern
            const time = Date.now() * particle.userData.speed;
            
            particle.position.x = particle.userData.originalX + Math.sin(time) * 0.1;
            particle.position.y = particle.userData.originalY + Math.cos(time) * 0.1;
            particle.position.z = particle.userData.originalZ + Math.sin(time + Math.PI/2) * 0.1;
          }
        });
        
        // Update connections
        connections.forEach(connection => {
          if (connection.userData && connection.userData.particleA && connection.userData.particleB) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              connection.userData.particleA.position,
              connection.userData.particleB.position
            ]);
            
            connection.geometry.dispose();
            connection.geometry = lineGeometry;
          }
        });
        
        // Render scene
        renderer.render(scene, camera);
      }
      
      return animationId;
    };
    
    const animationId = animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', checkVisibility);
      cancelAnimationFrame(animationId);
      
      // Dispose geometries and materials
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      // Remove renderer from DOM
      if (mountNode && mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default ThreeContact;