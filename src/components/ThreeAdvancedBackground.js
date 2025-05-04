import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeAdvancedBackground = () => {
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
    camera.position.z = 30;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Add renderer to DOM
    const mountNode = mountRef.current;
    mountNode.appendChild(renderer.domElement);
    
    // Create a galaxy effect
    const createGalaxy = () => {
      const galaxyGroup = new THREE.Group();
      scene.add(galaxyGroup);
      
      // Parameters
      const params = {
        count: 7000,
        size: 0.01,
        radius: 10,
        branches: 5,
        spin: 1,
        randomness: 0.5,
        randomnessPower: 3,
        insideColor: 0xff6030,
        outsideColor: 0x1b3984
      };
      
      // Geometry
      const geometry = new THREE.BufferGeometry();
      
      const positions = new Float32Array(params.count * 3);
      const colors = new Float32Array(params.count * 3);
      
      const colorInside = new THREE.Color(params.insideColor);
      const colorOutside = new THREE.Color(params.outsideColor);
      
      for (let i = 0; i < params.count; i++) {
        const i3 = i * 3;
        
        // Position
        const radius = Math.random() * params.radius;
        const spinAngle = radius * params.spin;
        const branchAngle = (i % params.branches) / params.branches * Math.PI * 2;
        
        const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
        const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
        const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
        
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        
        // Color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / params.radius);
        
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      // Material
      const material = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });
      
      // Points
      const points = new THREE.Points(geometry, material);
      galaxyGroup.add(points);
      
      return { galaxyGroup, points };
    };
    
    // Create flowing particles
    const createFlowingParticles = () => {
      const particlesGroup = new THREE.Group();
      scene.add(particlesGroup);
      
      // Parameters
      const count = 500;
      
      // Geometry
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const scales = new Float32Array(count);
      const speeds = new Float32Array(count);
      const offsets = new Float32Array(count);
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Random position in a sphere
        const radius = 15 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Random scale and speed
        scales[i] = Math.random() * 2 + 0.5;
        speeds[i] = Math.random() * 0.02 + 0.005;
        offsets[i] = Math.random() * Math.PI * 2;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
      geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
      geometry.setAttribute('offset', new THREE.BufferAttribute(offsets, 1));
      
      // Material
      const material = new THREE.PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        color: 0x64ffda,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      
      // Points
      const particles = new THREE.Points(geometry, material);
      particlesGroup.add(particles);
      
      return { particlesGroup, particles };
    };
    
    // Create nebula effect
    const createNebula = () => {
      const nebulaGroup = new THREE.Group();
      scene.add(nebulaGroup);
      
      // Create several cloud-like shapes
      const cloudCount = 5;
      const clouds = [];
      
      for (let i = 0; i < cloudCount; i++) {
        const geometry = new THREE.SphereGeometry(3 + Math.random() * 2, 32, 32);
        
        // Create a gradient color
        const color1 = new THREE.Color(0x1a237e); // Deep blue
        const color2 = new THREE.Color(0x7c4dff); // Purple
        
        const material = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? color1 : color2,
          transparent: true,
          opacity: 0.05,
          blending: THREE.AdditiveBlending
        });
        
        const cloud = new THREE.Mesh(geometry, material);
        
        // Position clouds in a cluster
        const distance = 10 + Math.random() * 5;
        const angle = Math.random() * Math.PI * 2;
        
        cloud.position.x = Math.cos(angle) * distance;
        cloud.position.y = (Math.random() - 0.5) * 10;
        cloud.position.z = Math.sin(angle) * distance;
        
        // Scale randomly
        const scale = 1 + Math.random() * 2;
        cloud.scale.set(scale, scale, scale);
        
        // Animation properties
        cloud.userData = {
          rotateSpeed: (Math.random() - 0.5) * 0.001,
          pulseSpeed: Math.random() * 0.002 + 0.001,
          pulsePhase: Math.random() * Math.PI * 2
        };
        
        nebulaGroup.add(cloud);
        clouds.push(cloud);
      }
      
      return { nebulaGroup, clouds };
    };
    
    // Create cosmic dust
    const createCosmicDust = () => {
      const dustGroup = new THREE.Group();
      scene.add(dustGroup);
      
      // Parameters
      const count = 2000;
      
      // Geometry
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Random position in a large sphere
        const radius = 20 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      // Material
      const material = new THREE.PointsMaterial({
        size: 0.03,
        sizeAttenuation: true,
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });
      
      // Points
      const dust = new THREE.Points(geometry, material);
      dustGroup.add(dust);
      
      return { dustGroup, dust };
    };
    
    // Create all elements
    const { galaxyGroup } = createGalaxy();
    const { particlesGroup, particles } = createFlowingParticles();
    const { nebulaGroup, clouds } = createNebula();
    const { dustGroup } = createCosmicDust();
    
    // Create a central glow
    const createCentralGlow = () => {
      const geometry = new THREE.SphereGeometry(2, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      
      return sphere;
    };
    
    const centralGlow = createCentralGlow();
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
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
    
    // Scroll interaction
    let scrollY = 0;
    let targetScrollY = 0;
    
    const handleScroll = () => {
      targetScrollY = window.scrollY * 0.0005;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      // Smooth camera movement based on mouse
      targetX = mouseX * 5;
      targetY = mouseY * 5;
      
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      // Rotate galaxy
      galaxyGroup.rotation.y = elapsedTime * 0.05;
      
      // Animate flowing particles
      const positions = particles.geometry.attributes.position.array;
      const scales = particles.geometry.attributes.scale.array;
      const speeds = particles.geometry.attributes.speed.array;
      const offsets = particles.geometry.attributes.offset.array;
      
      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        
        // Move particles in a wave pattern
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        
        // Calculate distance from center
        const distance = Math.sqrt(x * x + y * y + z * z);
        
        // Normalize to get direction
        const nx = x / distance;
        const ny = y / distance;
        const nz = z / distance;
        
        // Move particles in and out in a breathing effect
        const breathingEffect = Math.sin(elapsedTime * speeds[i] + offsets[i]) * 2;
        
        positions[i3] = nx * (distance + breathingEffect);
        positions[i3 + 1] = ny * (distance + breathingEffect);
        positions[i3 + 2] = nz * (distance + breathingEffect);
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Rotate particles group
      particlesGroup.rotation.y = elapsedTime * 0.1;
      
      // Animate nebula clouds
      clouds.forEach(cloud => {
        if (cloud.userData) {
          // Slow rotation
          cloud.rotation.x += cloud.userData.rotateSpeed;
          cloud.rotation.y += cloud.userData.rotateSpeed * 0.8;
          
          // Pulsating effect
          const scale = 1 + Math.sin(elapsedTime * cloud.userData.pulseSpeed + cloud.userData.pulsePhase) * 0.2;
          cloud.scale.set(scale, scale, scale);
        }
      });
      
      // Rotate dust
      dustGroup.rotation.y = elapsedTime * 0.02;
      
      // Pulse central glow
      const glowScale = 1 + Math.sin(elapsedTime * 0.5) * 0.3;
      centralGlow.scale.set(glowScale, glowScale, glowScale);
      
      // Apply scroll effect - rotate entire scene
      scrollY += (targetScrollY - scrollY) * 0.1;
      scene.rotation.y = scrollY * 2;
      
      // Render scene
      renderer.render(scene, camera);
      
      return animationId;
    };
    
    const animationId = animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
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
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default ThreeAdvancedBackground;