import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeSkills = () => {
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
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Add renderer to DOM
    mountRef.current.appendChild(renderer.domElement);
    
    // Create a 3D skill sphere
    const createSkillSphere = () => {
      // Create a group to hold all skill objects
      const skillsGroup = new THREE.Group();
      scene.add(skillsGroup);
      
      // Define skills with colors
      const skills = [
        { name: 'JavaScript', color: 0xf7df1e },
        { name: 'React', color: 0x61dafb },
        { name: 'Node.js', color: 0x3c873a },
        { name: 'Python', color: 0x3776ab },
        { name: 'HTML/CSS', color: 0xe34c26 },
        { name: 'TypeScript', color: 0x007acc },
        { name: 'MongoDB', color: 0x4db33d },
        { name: 'AWS', color: 0xff9900 },
        { name: 'Docker', color: 0x2496ed },
        { name: 'GraphQL', color: 0xe10098 },
        { name: 'Git', color: 0xf05032 },
        { name: 'SQL', color: 0x4479a1 },
        { name: 'Redux', color: 0x764abc },
        { name: 'Express', color: 0x000000 },
        { name: 'Tailwind', color: 0x38b2ac },
        { name: 'Three.js', color: 0x000000 },
      ];
      
      // Create a sphere layout for skills
      const radius = 2.5;
      const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      
      skills.forEach((skill, index) => {
        // Calculate position on a sphere
        const phi = Math.acos(-1 + (2 * index) / skills.length);
        const theta = Math.sqrt(skills.length * Math.PI) * phi;
        
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        
        // Create skill sphere
        const material = new THREE.MeshBasicMaterial({ 
          color: skill.color,
          transparent: true,
          opacity: 0.8
        });
        
        const mesh = new THREE.Mesh(sphereGeometry, material);
        mesh.position.set(x, y, z);
        
        // Store skill name and initial position
        mesh.userData = {
          name: skill.name,
          initialX: x,
          initialY: y,
          initialZ: z,
          pulsateSpeed: 0.005 + Math.random() * 0.005,
          pulsatePhase: Math.random() * Math.PI * 2
        };
        
        skillsGroup.add(mesh);
      });
      
      // Create connecting lines between skills
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x64ffda,
        transparent: true,
        opacity: 0.2
      });
      
      // Connect each skill to its nearest neighbors
      for (let i = 0; i < skillsGroup.children.length; i++) {
        const skill1 = skillsGroup.children[i];
        
        // Find 2-3 closest skills
        const distances = [];
        
        for (let j = 0; j < skillsGroup.children.length; j++) {
          if (i !== j) {
            const skill2 = skillsGroup.children[j];
            const distance = skill1.position.distanceTo(skill2.position);
            distances.push({ index: j, distance });
          }
        }
        
        // Sort by distance and take the closest 2-3
        distances.sort((a, b) => a.distance - b.distance);
        const connectCount = Math.floor(Math.random() * 2) + 2; // 2-3 connections
        
        for (let k = 0; k < Math.min(connectCount, distances.length); k++) {
          const skill2 = skillsGroup.children[distances[k].index];
          
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            skill1.position,
            skill2.position
          ]);
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          line.userData = {
            fromSkill: skill1,
            toSkill: skill2
          };
          
          skillsGroup.add(line);
        }
      }
      
      return skillsGroup;
    };
    
    // Create skill sphere
    const skillsGroup = createSkillSphere();
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Calculate target rotation based on mouse position
      targetRotationY = mouseX * 0.5;
      targetRotationX = mouseY * 0.5;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle scroll to show/hide the animation
    let isVisible = false;
    const skillsSection = document.getElementById('skills');
    
    const checkVisibility = () => {
      if (!skillsSection) return;
      
      const rect = skillsSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if skills section is in viewport
      isVisible = rect.top < windowHeight && rect.bottom > 0;
    };
    
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Initial check
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      checkVisibility();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Only animate when visible
      if (isVisible) {
        // Smooth rotation
        currentRotationX += (targetRotationX - currentRotationX) * 0.05;
        currentRotationY += (targetRotationY - currentRotationY) * 0.05;
        
        skillsGroup.rotation.x = currentRotationX;
        skillsGroup.rotation.y = currentRotationY;
        
        // Auto-rotation (very slow)
        skillsGroup.rotation.y += 0.001;
        
        // Animate skill spheres
        skillsGroup.children.forEach(child => {
          if (child instanceof THREE.Mesh && child.userData) {
            // Pulsate effect
            const scale = 1 + Math.sin(Date.now() * child.userData.pulsateSpeed + child.userData.pulsatePhase) * 0.1;
            child.scale.set(scale, scale, scale);
          } else if (child instanceof THREE.Line && child.userData) {
            // Update line positions to follow skills
            if (child.userData.fromSkill && child.userData.toSkill) {
              const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                child.userData.fromSkill.position,
                child.userData.toSkill.position
              ]);
              
              child.geometry.dispose();
              child.geometry = lineGeometry;
            }
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
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default ThreeSkills;