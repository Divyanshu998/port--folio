import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeAbout = () => {
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
      antialias: true,
      precision: 'mediump'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Add renderer to DOM
    const mountNode = mountRef.current;
    mountNode.appendChild(renderer.domElement);
    
    // Create a DNA helix structure (representing technology and biology)
    const createDNAHelix = () => {
      const helixGroup = new THREE.Group();
      scene.add(helixGroup);
      
      // Parameters
      const params = {
        strands: 2,
        strandRadius: 0.1,
        helixRadius: 1.2,
        helixHeight: 6,
        segments: 40,
        rungs: 15,
        rungRadius: 0.03,
        rungLength: 1.8
      };
      
      // Create the strands
      const strandGeometry = new THREE.SphereGeometry(params.strandRadius, 8, 8);
      
      const strandMaterial1 = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        transparent: true,
        opacity: 0.8
      });
      
      const strandMaterial2 = new THREE.MeshBasicMaterial({
        color: 0x7c4dff,
        transparent: true,
        opacity: 0.8
      });
      
      // Create strand points
      const strand1Points = [];
      const strand2Points = [];
      
      for (let i = 0; i <= params.segments; i++) {
        const angle = (i / params.segments) * Math.PI * 4; // Two full rotations
        const y = (i / params.segments) * params.helixHeight - params.helixHeight / 2;
        
        // First strand
        const x1 = Math.cos(angle) * params.helixRadius;
        const z1 = Math.sin(angle) * params.helixRadius;
        
        // Second strand (180 degrees offset)
        const x2 = Math.cos(angle + Math.PI) * params.helixRadius;
        const z2 = Math.sin(angle + Math.PI) * params.helixRadius;
        
        strand1Points.push(new THREE.Vector3(x1, y, z1));
        strand2Points.push(new THREE.Vector3(x2, y, z2));
        
        // Add spheres at each point
        if (i % 2 === 0) {
          const sphere1 = new THREE.Mesh(strandGeometry, strandMaterial1);
          sphere1.position.set(x1, y, z1);
          helixGroup.add(sphere1);
          
          const sphere2 = new THREE.Mesh(strandGeometry, strandMaterial2);
          sphere2.position.set(x2, y, z2);
          helixGroup.add(sphere2);
        }
      }
      
      // Create rungs (connections between strands)
      const rungGeometry = new THREE.CylinderGeometry(
        params.rungRadius, 
        params.rungRadius, 
        params.rungLength, 
        8
      );
      
      const rungMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4
      });
      
      // Add rungs at regular intervals
      for (let i = 0; i < params.rungs; i++) {
        const index = Math.floor((i / params.rungs) * strand1Points.length);
        
        if (index < strand1Points.length) {
          const point1 = strand1Points[index];
          const point2 = strand2Points[index];
          
          // Calculate midpoint and direction
          const midpoint = new THREE.Vector3().addVectors(point1, point2).multiplyScalar(0.5);
          const direction = new THREE.Vector3().subVectors(point2, point1).normalize();
          
          // Create rung
          const rung = new THREE.Mesh(rungGeometry, rungMaterial);
          rung.position.copy(midpoint);
          
          // Orient rung to connect the two points
          rung.lookAt(point2);
          rung.rotateX(Math.PI / 2);
          
          // Scale to fit between points
          const distance = point1.distanceTo(point2);
          rung.scale.y = distance / params.rungLength;
          
          helixGroup.add(rung);
        }
      }
      
      return helixGroup;
    };
    
    // Create floating tech icons
    const createTechIcons = () => {
      const iconsGroup = new THREE.Group();
      scene.add(iconsGroup);
      
      // Create several floating cubes representing tech icons
      const iconCount = 10;
      const icons = [];
      
      for (let i = 0; i < iconCount; i++) {
        // Create a cube
        const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        
        // Different colors for different icons
        const colors = [0x64ffda, 0x7c4dff, 0xff6b6b, 0xffd166, 0x06d6a0];
        const color = colors[i % colors.length];
        
        const material = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.7,
          wireframe: true
        });
        
        const icon = new THREE.Mesh(geometry, material);
        
        // Position in a sphere around the DNA
        const radius = 3.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        icon.position.x = radius * Math.sin(phi) * Math.cos(theta);
        icon.position.y = radius * Math.sin(phi) * Math.sin(theta) * 0.5; // Flatten vertically
        icon.position.z = radius * Math.cos(phi);
        
        // Animation properties
        icon.userData = {
          originalPosition: icon.position.clone(),
          rotateSpeed: Math.random() * 0.02 + 0.01,
          orbitSpeed: Math.random() * 0.005 + 0.002,
          orbitRadius: Math.random() * 0.3 + 0.2,
          orbitPhase: Math.random() * Math.PI * 2
        };
        
        iconsGroup.add(icon);
        icons.push(icon);
      }
      
      return { iconsGroup, icons };
    };
    
    // Create all elements
    const dnaHelix = createDNAHelix();
    const { iconsGroup, icons } = createTechIcons();
    
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
    const aboutSection = document.getElementById('about');
    
    const checkVisibility = () => {
      if (!aboutSection) return;
      
      const rect = aboutSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if about section is in viewport
      isVisible = rect.top < windowHeight && rect.bottom > 0;
    };
    
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Initial check
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Only animate when visible
      if (isVisible) {
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate DNA helix
        dnaHelix.rotation.y = elapsedTime * 0.2;
        
        // Rotate based on mouse position
        dnaHelix.rotation.x = mouseY * 0.2;
        dnaHelix.rotation.z = mouseX * 0.1;
        
        // Animate tech icons
        icons.forEach(icon => {
          if (icon.userData) {
            // Rotation
            icon.rotation.x += icon.userData.rotateSpeed;
            icon.rotation.y += icon.userData.rotateSpeed * 0.8;
            
            // Orbit around original position
            const orbitX = Math.cos(elapsedTime * icon.userData.orbitSpeed + icon.userData.orbitPhase) * icon.userData.orbitRadius;
            const orbitY = Math.sin(elapsedTime * icon.userData.orbitSpeed + icon.userData.orbitPhase) * icon.userData.orbitRadius;
            const orbitZ = Math.cos(elapsedTime * icon.userData.orbitSpeed * 0.5 + icon.userData.orbitPhase) * icon.userData.orbitRadius;
            
            icon.position.x = icon.userData.originalPosition.x + orbitX;
            icon.position.y = icon.userData.originalPosition.y + orbitY;
            icon.position.z = icon.userData.originalPosition.z + orbitZ;
          }
        });
        
        // Rotate icons group slightly
        iconsGroup.rotation.y = elapsedTime * 0.05;
        
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

export default ThreeAbout;