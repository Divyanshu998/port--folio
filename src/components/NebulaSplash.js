import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const NebulaSplash = () => {
  const mountRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (isInitialized) return; // Prevent multiple initializations
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 30;
    
    setIsInitialized(true);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    
    // Add renderer to DOM
    const mountNode = mountRef.current;
    mountNode.appendChild(renderer.domElement);
    
    // Mouse position tracking
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Create text geometry for the name
    const createTextGeometry = (text) => {
      // We'll use points to simulate text
      // In a real project, you would use TextGeometry from THREE.js
      // But for simplicity and performance, we'll create a point cloud in the shape of text
      
      const textPoints = [];
      const textSize = 10;
      const gridSize = 0.2; // Smaller grid size for more detailed text
      
      // Simple function to draw text using points
      // This is a simplified approach - in a real project you'd use TextGeometry
      const drawLetter = (letter, offsetX) => {
        const letterWidth = 5;
        
        // D
        if (letter === 'D') {
          // Vertical line
          for (let y = -textSize/2; y <= textSize/2; y += gridSize) {
            textPoints.push(new THREE.Vector3(offsetX, y, 0));
          }
          
          // Top curve
          for (let x = 0; x <= letterWidth; x += gridSize) {
            const angle = (x / letterWidth) * Math.PI * 0.5;
            const y = Math.sin(angle) * textSize/2;
            textPoints.push(new THREE.Vector3(offsetX + x, y, 0));
          }
          
          // Bottom curve
          for (let x = 0; x <= letterWidth; x += gridSize) {
            const angle = (x / letterWidth) * Math.PI * 0.5 + Math.PI * 1.5;
            const y = Math.sin(angle) * textSize/2;
            textPoints.push(new THREE.Vector3(offsetX + x, y, 0));
          }
          
          return letterWidth + 1;
        }
        
        // I
        if (letter === 'I') {
          for (let y = -textSize/2; y <= textSize/2; y += gridSize) {
            textPoints.push(new THREE.Vector3(offsetX + letterWidth/2, y, 0));
          }
          
          // Top and bottom bars
          for (let x = 0; x <= letterWidth; x += gridSize) {
            textPoints.push(new THREE.Vector3(offsetX + x, textSize/2, 0));
            textPoints.push(new THREE.Vector3(offsetX + x, -textSize/2, 0));
          }
          
          return letterWidth + 1;
        }
        
        // V
        if (letter === 'V') {
          for (let y = textSize/2; y >= -textSize/2; y -= gridSize) {
            const progress = (textSize/2 - y) / textSize;
            const x1 = offsetX + progress * letterWidth/2;
            const x2 = offsetX + letterWidth - progress * letterWidth/2;
            textPoints.push(new THREE.Vector3(x1, y, 0));
            textPoints.push(new THREE.Vector3(x2, y, 0));
          }
          
          return letterWidth + 1;
        }
        
        // Y
        if (letter === 'Y') {
          // Top half of the Y
          for (let y = textSize/2; y >= 0; y -= gridSize) {
            const progress = (textSize/2 - y) / (textSize/2);
            const x1 = offsetX + progress * letterWidth/2;
            const x2 = offsetX + letterWidth - progress * letterWidth/2;
            textPoints.push(new THREE.Vector3(x1, y, 0));
            textPoints.push(new THREE.Vector3(x2, y, 0));
          }
          
          // Bottom half of the Y
          for (let y = 0; y >= -textSize/2; y -= gridSize) {
            textPoints.push(new THREE.Vector3(offsetX + letterWidth/2, y, 0));
          }
          
          return letterWidth + 1;
        }
        
        // A
        if (letter === 'A') {
          for (let y = -textSize/2; y <= textSize/2; y += gridSize) {
            const progress = (y + textSize/2) / textSize;
            const width = letterWidth * (1 - progress * 0.5);
            const x1 = offsetX + (letterWidth - width) / 2;
            const x2 = offsetX + letterWidth - (letterWidth - width) / 2;
            textPoints.push(new THREE.Vector3(x1, y, 0));
            textPoints.push(new THREE.Vector3(x2, y, 0));
            
            // Middle bar
            if (Math.abs(y) < gridSize) {
              for (let x = x1; x <= x2; x += gridSize) {
                textPoints.push(new THREE.Vector3(x, y, 0));
              }
            }
          }
          
          return letterWidth + 1;
        }
        
        // N
        if (letter === 'N') {
          // Left vertical
          for (let y = -textSize/2; y <= textSize/2; y += gridSize) {
            textPoints.push(new THREE.Vector3(offsetX, y, 0));
          }
          
          // Right vertical
          for (let y = -textSize/2; y <= textSize/2; y += gridSize) {
            textPoints.push(new THREE.Vector3(offsetX + letterWidth, y, 0));
          }
          
          // Diagonal
          for (let y = -textSize/2; y <= textSize/2; y += gridSize) {
            const progress = (y + textSize/2) / textSize;
            const x = offsetX + progress * letterWidth;
            textPoints.push(new THREE.Vector3(x, y, 0));
          }
          
          return letterWidth + 1;
        }
        
        // S
        if (letter === 'S') {
          // Top curve
          for (let angle = 0; angle <= Math.PI; angle += 0.1) {
            const x = offsetX + letterWidth/2 + Math.cos(angle) * letterWidth/2;
            const y = textSize/4 + Math.sin(angle) * textSize/4;
            textPoints.push(new THREE.Vector3(x, y, 0));
          }
          
          // Middle section
          for (let x = offsetX + letterWidth; x >= offsetX; x -= gridSize) {
            textPoints.push(new THREE.Vector3(x, 0, 0));
          }
          
          // Bottom curve
          for (let angle = Math.PI; angle <= Math.PI * 2; angle += 0.1) {
            const x = offsetX + letterWidth/2 + Math.cos(angle) * letterWidth/2;
            const y = -textSize/4 + Math.sin(angle) * textSize/4;
            textPoints.push(new THREE.Vector3(x, y, 0));
          }
          
          return letterWidth + 1;
        }
        
        // H
        if (letter === 'H') {
          // Left vertical
          for (let y = -textSize/2; y <= textSize/2; y += gridSize) {
            textPoints.push(new THREE.Vector3(offsetX, y, 0));
          }
          
          // Right vertical
          for (let y = -textSize/2; y <= textSize/2; y += gridSize) {
            textPoints.push(new THREE.Vector3(offsetX + letterWidth, y, 0));
          }
          
          // Middle bar
          for (let x = offsetX; x <= offsetX + letterWidth; x += gridSize) {
            textPoints.push(new THREE.Vector3(x, 0, 0));
          }
          
          return letterWidth + 1;
        }
        
        // U
        if (letter === 'U') {
          // Left vertical
          for (let y = textSize/2; y >= -textSize/4; y -= gridSize) {
            textPoints.push(new THREE.Vector3(offsetX, y, 0));
          }
          
          // Right vertical
          for (let y = textSize/2; y >= -textSize/4; y -= gridSize) {
            textPoints.push(new THREE.Vector3(offsetX + letterWidth, y, 0));
          }
          
          // Bottom curve
          for (let angle = Math.PI; angle <= Math.PI * 2; angle += 0.1) {
            const x = offsetX + letterWidth/2 + Math.cos(angle) * letterWidth/2;
            const y = -textSize/4 + Math.sin(angle) * textSize/4;
            textPoints.push(new THREE.Vector3(x, y, 0));
          }
          
          return letterWidth + 1;
        }
        
        return letterWidth + 1;
      };
      
      // Draw the name "DIVYANSHU"
      let currentX = -25; // Starting position
      currentX += drawLetter('D', currentX);
      currentX += drawLetter('I', currentX);
      currentX += drawLetter('V', currentX);
      currentX += drawLetter('Y', currentX);
      currentX += drawLetter('A', currentX);
      currentX += drawLetter('N', currentX);
      currentX += drawLetter('S', currentX);
      currentX += drawLetter('H', currentX);
      currentX += drawLetter('U', currentX);
      
      return textPoints;
    };
    
    // Create particles
    const createParticles = () => {
      // Get text points
      const textPoints = createTextGeometry("DIVYANSHU");
      
      // Create additional random particles for the nebula effect
      const particleCount = 3000; // Increased particle count for more density
      const nebulaPoints = [];
      
      // Create nebula particles with more structure
      for (let i = 0; i < particleCount; i++) {
        // Create a spiral galaxy-like structure
        let radius, theta, phi;
        
        if (Math.random() < 0.7) {
          // 70% of particles in a disc shape (spiral galaxy)
          radius = 5 + Math.random() * Math.random() * 80; // Quadratic distribution for density
          theta = Math.random() * Math.PI * 2;
          phi = (Math.random() - 0.5) * 0.2; // Flattened disc
          
          // Add spiral arms
          const armOffset = Math.floor(Math.random() * 3) * (Math.PI * 2 / 3);
          theta = theta + radius * 0.03 + armOffset;
        } else {
          // 30% of particles in a spherical halo
          radius = 20 + Math.random() * 80;
          theta = Math.random() * Math.PI * 2;
          phi = Math.acos(2 * Math.random() - 1);
        }
        
        // Convert spherical to cartesian coordinates
        const x = radius * Math.cos(theta) * Math.cos(phi);
        const y = radius * Math.sin(phi);
        const z = radius * Math.sin(theta) * Math.cos(phi) * 0.5; // Flatten z-axis
        
        nebulaPoints.push(new THREE.Vector3(x, y, z));
      }
      
      // Combine text and nebula points
      const allPoints = [...textPoints, ...nebulaPoints];
      
      // Create geometry
      const particlesGeometry = new THREE.BufferGeometry();
      
      // Create positions array
      const positions = new Float32Array(allPoints.length * 3);
      const originalPositions = new Float32Array(allPoints.length * 3);
      const colors = new Float32Array(allPoints.length * 3);
      const sizes = new Float32Array(allPoints.length);
      
      // Set positions and colors
      for (let i = 0; i < allPoints.length; i++) {
        const i3 = i * 3;
        
        // Position
        positions[i3] = allPoints[i].x;
        positions[i3 + 1] = allPoints[i].y;
        positions[i3 + 2] = allPoints[i].z;
        
        // Store original position for animation
        originalPositions[i3] = allPoints[i].x;
        originalPositions[i3 + 1] = allPoints[i].y;
        originalPositions[i3 + 2] = allPoints[i].z;
        
        // Color - different for text and nebula with enhanced color palette
        if (i < textPoints.length) {
          // Text particles - vibrant cyan/teal color with higher brightness
          colors[i3] = 0.2 + Math.random() * 0.1;     // R - low
          colors[i3 + 1] = 0.9 + Math.random() * 0.1; // G - higher (brighter)
          colors[i3 + 2] = 1.0;                       // B - maximum brightness
          sizes[i] = Math.random() * 0.4 + 1.2;       // Much larger for better visibility
        } else {
          // Nebula particles - cosmic color palette
          // Create a gradient of colors from blue/purple to pink/orange
          const colorChoice = Math.random();
          
          if (colorChoice < 0.4) {
            // Blue/purple nebula regions
            colors[i3] = 0.3 + Math.random() * 0.2;     // R - low
            colors[i3 + 1] = 0.1 + Math.random() * 0.2; // G - very low
            colors[i3 + 2] = 0.8 + Math.random() * 0.2; // B - high
          } else if (colorChoice < 0.7) {
            // Pink/magenta nebula regions
            colors[i3] = 0.8 + Math.random() * 0.2;     // R - high
            colors[i3 + 1] = 0.2 + Math.random() * 0.2; // G - low
            colors[i3 + 2] = 0.8 + Math.random() * 0.2; // B - high
          } else {
            // Cyan/teal nebula regions (complementary to text)
            colors[i3] = 0.1 + Math.random() * 0.1;     // R - very low
            colors[i3 + 1] = 0.6 + Math.random() * 0.4; // G - medium-high
            colors[i3 + 2] = 0.7 + Math.random() * 0.3; // B - high
          }
          
          // Vary particle sizes more dramatically for depth
          sizes[i] = Math.random() * Math.random() * 3 + 0.5; // Quadratic distribution
        }
      }
      
      // Add attributes to geometry
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      // Store original positions for animation
      particlesGeometry.userData.originalPositions = originalPositions;
      particlesGeometry.userData.textParticleCount = textPoints.length;
      
      // Create material with better blending for particles
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
      });
      
      // Create points
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
      
      return particles;
    };
    
    // Create particles
    const particles = createParticles();
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      // Smooth mouse movement
      mouse.x += (targetMouse.x - mouse.x) * 0.1;
      mouse.y += (targetMouse.y - mouse.y) * 0.1;
      
      // Update particles
      const positions = particles.geometry.attributes.position.array;
      const originalPositions = particles.geometry.userData.originalPositions;
      const textParticleCount = particles.geometry.userData.textParticleCount;
      
      // Calculate burst effect based on mouse movement - reduced strength
      const burstStrength = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 5; // Reduced multiplier
      
      // Update each particle
      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        
        // Different behavior for text vs nebula particles
        if (i < textParticleCount) {
          // Text particles - they form the text and react to mouse
          const originalX = originalPositions[i3];
          const originalY = originalPositions[i3 + 1];
          const originalZ = originalPositions[i3 + 2];
          
          // Distance from mouse (in normalized coordinates)
          const dx = originalX / 30 - mouse.x;
          const dy = originalY / 30 - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Reduced burst effect - slower and more visible movement
          const repelFactor = Math.max(0, 5 - dist) * 0.02; // Reduced factor
          const burstX = dx * repelFactor * burstStrength * 0.5; // Reduced strength
          const burstY = dy * repelFactor * burstStrength * 0.5; // Reduced strength
          
          // Time-based oscillation with slower movement
          const noiseX = Math.sin(elapsedTime * 0.2 + i * 0.05) * 0.1; // Slower, smaller oscillation
          const noiseY = Math.cos(elapsedTime * 0.2 + i * 0.05) * 0.1; // Slower, smaller oscillation
          
          // Combine effects
          positions[i3] = originalX + burstX + noiseX;
          positions[i3 + 1] = originalY + burstY + noiseY;
          positions[i3 + 2] = originalZ;
          
          // Return to original position more slowly
          positions[i3] += (originalX - positions[i3]) * 0.01; // Slower return
          positions[i3 + 1] += (originalY - positions[i3 + 1]) * 0.01; // Slower return
          positions[i3 + 2] += (originalZ - positions[i3 + 2]) * 0.01; // Slower return
        } else {
          // Nebula particles - they flow around more slowly
          const originalX = originalPositions[i3];
          const originalY = originalPositions[i3 + 1];
          const originalZ = originalPositions[i3 + 2];
          
          // Slower noise-based movement
          const angle = elapsedTime * 0.05 + i * 0.005; // Slower rotation
          const radius = 20 + Math.sin(i * 0.1) * 10;
          
          // Reduced circular motion
          const circleX = Math.cos(angle) * radius * 0.1; // Reduced amplitude
          const circleY = Math.sin(angle) * radius * 0.1; // Reduced amplitude
          
          // Reduced mouse influence
          const mouseInfluenceX = mouse.x * 10; // Less mouse influence
          const mouseInfluenceY = mouse.y * 10; // Less mouse influence
          
          // Combine effects
          positions[i3] = originalX + circleX + mouseInfluenceX;
          positions[i3 + 1] = originalY + circleY + mouseInfluenceY;
          
          // Slower Z-position oscillation for depth
          positions[i3 + 2] = originalZ + Math.sin(elapsedTime * 0.1 + i * 0.05) * 3; // Slower, smaller oscillation
          
          // Very slowly return to original position
          positions[i3] += (originalX - positions[i3]) * 0.005; // Even slower return
          positions[i3 + 1] += (originalY - positions[i3 + 1]) * 0.005; // Even slower return
          positions[i3 + 2] += (originalZ - positions[i3 + 2]) * 0.005; // Even slower return
        }
      }
      
      // Update size attribute for pulsing effect
      const sizes = particles.geometry.attributes.size.array;
      for (let i = 0; i < sizes.length; i++) {
        // Different pulsing for text vs nebula - more subtle and slower
        if (i < textParticleCount) {
          // Text particles - larger and more visible with subtle pulsing
          const pulseFactor = Math.sin(elapsedTime * 0.8) * 0.1 + 0.9; // Slower, more subtle pulse
          // Very minimal individual variation
          const individualPulse = Math.sin(elapsedTime * 1.2 + i * 0.05) * 0.05 + 1.0; // Minimal variation
          sizes[i] = pulseFactor * individualPulse * 1.0; // Larger base size
        } else {
          // Nebula particles have slower, more subtle pulsing
          const basePulse = Math.sin(elapsedTime * 0.2 + i * 0.02) * 0.3 + 1.5; // Slower pulse
          // Add secondary frequency for more organic feel
          const secondaryPulse = Math.sin(elapsedTime * 0.1 + i * 0.01) * 0.2 + 1.0; // Slower secondary pulse
          sizes[i] = basePulse * secondaryPulse * 0.6; // Slightly smaller
          
          // Make particles near mouse larger
          const particlePos = new THREE.Vector3(
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2]
          );
          
          // Project to screen space
          particlePos.project(camera);
          
          // Distance to mouse in screen space
          const dx = particlePos.x - mouse.x;
          const dy = particlePos.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Increase size for particles near mouse
          if (dist < 0.5) {
            sizes[i] *= 1 + (0.5 - dist) * 3;
          }
        }
      }
      
      // Update color for dynamic effects
      const colors = particles.geometry.attributes.color.array;
      for (let i = textParticleCount; i < positions.length / 3; i++) {
        const i3 = i * 3;
        
        // Shift hue over time for nebula particles
        const hueShift = (Math.sin(elapsedTime * 0.1 + i * 0.01) + 1) * 0.5; // 0 to 1
        
        // Apply color shift based on position and time
        if (positions[i3 + 2] > 0) {
          // Particles in front shift toward blue/purple
          colors[i3] = 0.3 + hueShift * 0.2;      // R
          colors[i3 + 1] = 0.2 + hueShift * 0.1;  // G
          colors[i3 + 2] = 0.7 + hueShift * 0.3;  // B
        } else {
          // Particles in back shift toward pink/orange
          colors[i3] = 0.7 + hueShift * 0.3;      // R
          colors[i3 + 1] = 0.3 + hueShift * 0.2;  // G
          colors[i3 + 2] = 0.5 + hueShift * 0.3;  // B
        }
      }
      
      // No shader uniforms to update with PointsMaterial
      
      // Update attributes
      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.size.needsUpdate = true;
      particles.geometry.attributes.color.needsUpdate = true;
      
      // Rotate scene very subtly based on mouse position
      scene.rotation.x += (mouse.y * 0.1 - scene.rotation.x) * 0.02; // Reduced rotation and slower damping
      scene.rotation.y += (mouse.x * 0.1 - scene.rotation.y) * 0.02; // Reduced rotation and slower damping
      
      // Render
      renderer.render(scene, camera);
      
      return animationId;
    };
    
    const animationId = animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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
  }, [isInitialized]);
  
  return (
    <div 
      ref={mountRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default NebulaSplash;