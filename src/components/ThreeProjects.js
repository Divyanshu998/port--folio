import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeProjects = () => {
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
    
    // Create a grid of cubes representing projects
    const createProjectGrid = () => {
      const gridGroup = new THREE.Group();
      scene.add(gridGroup);
      
      const rows = 4;
      const cols = 4;
      const spacing = 0.7;
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // Create cube
          const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
          const material = new THREE.MeshBasicMaterial({
            color: 0x64ffda,
            wireframe: true,
            transparent: true,
            opacity: 0.6
          });
          
          const cube = new THREE.Mesh(geometry, material);
          
          // Position in grid
          cube.position.x = (j - cols / 2 + 0.5) * spacing;
          cube.position.y = (i - rows / 2 + 0.5) * spacing;
          cube.position.z = 0;
          
          // Add animation properties
          cube.userData = {
            rotateSpeed: 0.01 + Math.random() * 0.01,
            pulseSpeed: 0.005 + Math.random() * 0.005,
            pulsePhase: Math.random() * Math.PI * 2,
            row: i,
            col: j
          };
          
          gridGroup.add(cube);
        }
      }
      
      return gridGroup;
    };
    
    // Create project grid
    const gridGroup = createProjectGrid();
    
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
    const projectsSection = document.getElementById('projects');
    
    const checkVisibility = () => {
      if (!projectsSection) return;
      
      const rect = projectsSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if projects section is in viewport
      isVisible = rect.top < windowHeight && rect.bottom > 0;
    };
    
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Initial check
    
    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Only animate when visible
      if (isVisible) {
        // Rotate the entire grid based on mouse position
        gridGroup.rotation.y = mouseX * 0.3;
        gridGroup.rotation.x = mouseY * 0.2;
        
        // Animate each cube
        gridGroup.children.forEach(cube => {
          if (cube.userData) {
            // Rotation
            cube.rotation.x += 0.01;
            cube.rotation.y += cube.userData.rotateSpeed;
            
            // Pulse effect
            const scale = 1 + Math.sin(Date.now() * cube.userData.pulseSpeed + cube.userData.pulsePhase) * 0.1;
            cube.scale.set(scale, scale, scale);
            
            // Wave effect across the grid
            const waveX = Math.sin(Date.now() * 0.001 + cube.userData.col * 0.5) * 0.1;
            const waveY = Math.cos(Date.now() * 0.001 + cube.userData.row * 0.5) * 0.1;
            cube.position.z = waveX + waveY;
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
      className="absolute top-0 right-0 w-1/3 h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default ThreeProjects;