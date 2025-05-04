import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';

const ThreeSolarSystem = () => {
  const mountRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (isInitialized) return; // Prevent multiple initializations
    
    // Scene setup - optimized for performance
    const scene = new THREE.Scene();
    
    // Camera setup - reduced FOV for better performance
    const camera = new THREE.PerspectiveCamera(
      50, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      100
    );
    camera.position.z = 20;
    camera.position.y = 10;
    camera.lookAt(0, 0, 0);
    
    setIsInitialized(true);
    
    // Renderer setup - optimized for performance
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: false, // Disable antialiasing for better performance
      powerPreference: "high-performance",
      precision: "lowp" // Lower precision for better performance
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio
    
    // Add renderer to DOM
    const mountNode = mountRef.current;
    mountNode.appendChild(renderer.domElement);
    
    // Texture loader
    const textureLoader = new TextureLoader();
    
    // Create sun with optimized appearance
    const createSun = () => {
      // Create a simplified sun with fewer polygons
      const geometry = new THREE.SphereGeometry(2, 32, 32); // Reduced segments
      
      // Main sun material - using BasicMaterial for better performance
      const material = new THREE.MeshBasicMaterial({
        color: 0xffdd00
      });
      
      const sun = new THREE.Mesh(geometry, material);
      scene.add(sun);
      
      // Create just two glow layers for better performance
      const createGlowLayer = (radius, color, opacity) => {
        const glowGeometry = new THREE.SphereGeometry(radius, 16, 16); // Reduced segments
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: opacity,
          side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        scene.add(glow);
        return glow;
      };
      
      // Create just two layers with different sizes and colors
      const innerGlow = createGlowLayer(2.2, 0xff8800, 0.4);
      const outerGlow = createGlowLayer(3.0, 0xff4400, 0.2);
      
      // Create simplified sun flares with fewer particles
      const flareGeometry = new THREE.BufferGeometry();
      const flareCount = 30; // Reduced count
      const flarePositions = new Float32Array(flareCount * 3);
      
      for (let i = 0; i < flareCount; i++) {
        const i3 = i * 3;
        const radius = 2 + Math.random() * 0.3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        flarePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        flarePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        flarePositions[i3 + 2] = radius * Math.cos(phi);
      }
      
      flareGeometry.setAttribute('position', new THREE.BufferAttribute(flarePositions, 3));
      
      const flareMaterial = new THREE.PointsMaterial({
        color: 0xffaa00,
        size: 0.2,
        transparent: true,
        opacity: 0.8
      });
      
      const flares = new THREE.Points(flareGeometry, flareMaterial);
      scene.add(flares);
      
      return { 
        sun, 
        glows: [innerGlow, outerGlow],
        flares 
      };
    };
    
    // Create planet with orbit - optimized
    const createPlanet = (radius, color, orbitRadius, orbitSpeed, textureUrl = null) => {
      // Planet geometry - reduced segments
      const geometry = new THREE.SphereGeometry(radius, 16, 16);
      
      // Planet material - using BasicMaterial for better performance
      let material;
      if (textureUrl) {
        const texture = textureLoader.load(textureUrl);
        material = new THREE.MeshBasicMaterial({
          map: texture
        });
      } else {
        material = new THREE.MeshBasicMaterial({
          color: color
        });
      }
      
      const planet = new THREE.Mesh(geometry, material);
      
      // Create orbit - reduced segments
      const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.05, orbitRadius + 0.05, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      });
      
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
      
      // Create planet group for positioning
      const planetGroup = new THREE.Group();
      planetGroup.add(planet);
      scene.add(planetGroup);
      
      // Set initial position
      planet.position.x = orbitRadius;
      
      return {
        planet,
        planetGroup,
        orbit,
        orbitRadius,
        orbitSpeed
      };
    };
    
    // Create stars background - optimized with fewer stars
    const createStars = () => {
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.15,
        transparent: true,
        sizeAttenuation: false // Better performance
      });
      
      const starsVertices = [];
      // Reduced number of stars for better performance
      for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        starsVertices.push(x, y, z);
      }
      
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);
      
      return stars;
    };
    
    // Create asteroid belt - optimized with instanced meshes
    const createAsteroidBelt = (innerRadius, outerRadius, count) => {
      // Use instanced mesh for better performance
      const instancedGeometry = new THREE.SphereGeometry(0.15, 4, 4); // Simplified geometry
      const instancedMaterial = new THREE.MeshBasicMaterial({ // Basic material instead of Standard
        color: 0x888888
      });
      
      // Create instanced mesh
      const asteroidBelt = new THREE.InstancedMesh(
        instancedGeometry,
        instancedMaterial,
        count
      );
      
      // Create dummy for positioning
      const dummy = new THREE.Object3D();
      
      // Position each instance
      for (let i = 0; i < count; i++) {
        // Random position in belt
        const orbitRadius = innerRadius + Math.random() * (outerRadius - innerRadius);
        const angle = Math.random() * Math.PI * 2;
        
        dummy.position.x = Math.cos(angle) * orbitRadius;
        dummy.position.z = Math.sin(angle) * orbitRadius;
        dummy.position.y = (Math.random() - 0.5) * 0.3;
        
        // Random scale
        const scale = Math.random() * 0.5 + 0.5;
        dummy.scale.set(scale, scale, scale);
        
        // Random rotation
        dummy.rotation.x = Math.random() * Math.PI;
        dummy.rotation.y = Math.random() * Math.PI;
        dummy.rotation.z = Math.random() * Math.PI;
        
        // Update matrix
        dummy.updateMatrix();
        asteroidBelt.setMatrixAt(i, dummy.matrix);
        
        // Store orbit data in a separate array for animation
        asteroidBelt.userData.orbits = asteroidBelt.userData.orbits || [];
        asteroidBelt.userData.orbits.push({
          orbitRadius,
          orbitSpeed: 0.02 + Math.random() * 0.02,
          orbitAngle: angle,
          index: i
        });
      }
      
      scene.add(asteroidBelt);
      return asteroidBelt;
    };
    
    // Create all elements
    const { sun, glows, flares } = createSun();
    
    // Create planets with textures
    // Note: In a real project, you would use actual texture files from your assets folder
    // For this example, we'll use colors but the code is ready for textures
    
    // Mercury - closest to the sun
    const mercury = createPlanet(0.4, 0xaaaaaa, 4, 0.01);
    mercury.planet.userData = { name: "Mercury" };
    
    // Venus - second planet
    const venus = createPlanet(0.6, 0xe39e1c, 6, 0.007);
    venus.planet.userData = { name: "Venus" };
    
    // Earth - our home planet with a blue color
    const earth = createPlanet(0.7, 0x2233ff, 8, 0.005);
    earth.planet.userData = { name: "Earth" };
    
    // Create Earth's moon
    const createMoon = (parentPlanet) => {
      const moonGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const moonMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        roughness: 0.8,
        metalness: 0.1
      });
      
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      
      // Create a group for the moon's orbit
      const moonGroup = new THREE.Group();
      parentPlanet.planetGroup.add(moonGroup);
      moonGroup.add(moon);
      
      // Position moon
      moon.position.x = 1.2;
      
      // Tilt moon orbit
      moonGroup.rotation.z = Math.PI * 0.1;
      
      return { moon, moonGroup };
    };
    
    const { moon, moonGroup } = createMoon(earth);
    
    // Mars - the red planet
    const mars = createPlanet(0.5, 0xc1440e, 10, 0.004);
    mars.planet.userData = { name: "Mars" };
    
    // Jupiter - the largest planet
    const jupiter = createPlanet(1.2, 0xd8ca9d, 14, 0.002);
    jupiter.planet.userData = { name: "Jupiter" };
    
    // Saturn - with its distinctive rings
    const saturn = createPlanet(1.0, 0xead6b8, 18, 0.0015);
    saturn.planet.userData = { name: "Saturn" };
    
    // Create Saturn's rings
    const createSaturnRings = () => {
      const ringGeometry = new THREE.RingGeometry(1.2, 2, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xd1b894,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = Math.PI / 2;
      saturn.planet.add(rings);
      
      return rings;
    };
    
    const saturnRings = createSaturnRings();
    
    // Create asteroid belt
    const asteroidBelt = createAsteroidBelt(11.5, 13, 200);
    
    // Create stars
    const stars = createStars();
    
    // Create simplified text labels for planets - only for the closest planets
    const createPlanetLabels = () => {
      const labelGroup = new THREE.Group();
      scene.add(labelGroup);
      
      // Create canvas for text rendering - optimized
      const createTextSprite = (text) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128; // Smaller canvas
        canvas.height = 64;
        
        // Draw text on canvas
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'Bold 24px Arial'; // Smaller font
        context.fillStyle = '#64ffda';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        // Create material with the texture
        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true
        });
        
        // Create sprite
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1.5, 0.75, 1); // Smaller scale
        
        return sprite;
      };
      
      // Create labels only for the inner planets (better performance)
      const labels = {};
      
      // Only create labels for the closest planets
      [mercury, venus, earth, mars].forEach(planetObj => {
        const name = planetObj.planet.userData.name;
        const label = createTextSprite(name);
        label.visible = false; // Initially hidden
        
        // Store reference to planet
        label.userData = {
          planet: planetObj.planet,
          planetGroup: planetObj.planetGroup
        };
        
        labelGroup.add(label);
        labels[name] = label;
      });
      
      return { labelGroup, labels };
    };
    
    const { labelGroup, labels } = createPlanetLabels();
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffffff, 2, 50);
    scene.add(sunLight);
    
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
    
    // Continuous rotation with scroll enhancement
    let scrollY = 0;
    let targetScrollY = 0;
    let autoRotationSpeed = 0.001; // Base rotation speed when not scrolling
    
    const handleScroll = () => {
      // Convert scroll position to rotation angle
      // Scrolling will temporarily speed up the rotation
      targetScrollY = window.scrollY * 0.001 + autoRotationSpeed;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Animation loop - optimized
    const clock = new THREE.Clock();
    let lastTime = 0;
    const frameRate = 30; // Target 30 FPS for better performance
    const frameInterval = 1 / frameRate;
    
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      const currentTime = clock.getElapsedTime();
      const deltaTime = currentTime - lastTime;
      
      // Throttle updates to target frame rate
      if (deltaTime < frameInterval) return;
      
      // Calculate elapsed time
      const elapsedTime = currentTime;
      lastTime = currentTime - (deltaTime % frameInterval);
      
      // Update rotation - continuous with scroll enhancement
      // Increment autoRotationSpeed to ensure continuous rotation
      autoRotationSpeed += 0.0001;
      
      // If not scrolling, use auto rotation, otherwise enhance with scroll
      if (Math.abs(targetScrollY - autoRotationSpeed) < 0.002) {
        // No significant scrolling happening, use auto rotation
        scrollY += 0.001;
      } else {
        // Scrolling is happening, enhance rotation with scroll
        scrollY += (targetScrollY - scrollY) * 0.05;
      }
      
      // Rotate sun
      sun.rotation.y = elapsedTime * 0.1;
      
      // Animate sun glows
      glows.forEach((glow, index) => {
        // Rotate each glow layer at different speeds
        glow.rotation.y = -elapsedTime * (0.05 + index * 0.01);
        glow.rotation.z = elapsedTime * (0.03 + index * 0.005);
        
        // Pulse each glow layer with different phases
        const pulseScale = 1 + Math.sin(elapsedTime * 0.5 + index * 0.2) * 0.05;
        glow.scale.set(pulseScale, pulseScale, pulseScale);
      });
      
      // Rotate sun flares
      flares.rotation.y = elapsedTime * 0.2;
      flares.rotation.z = elapsedTime * 0.1;
      
      // Update planets - continuous rotation with scroll enhancement
      const planets = [mercury, venus, earth, mars, jupiter, saturn];
      
      planets.forEach(planet => {
        // Orbit rotation - continuous with scroll enhancement
        const baseSpeed = planet.orbitSpeed * 0.2; // Base continuous speed
        const scrollEnhancement = scrollY * (Math.PI * 2 * planet.orbitSpeed * 10);
        
        // Combine continuous rotation with scroll enhancement
        planet.planetGroup.rotation.y = scrollEnhancement + (elapsedTime * baseSpeed);
        
        // Self rotation - continuous
        planet.planet.rotation.y += planet.orbitSpeed * 1.5;
      });
      
      // Rotate Earth's moon
      if (moonGroup) {
        moonGroup.rotation.y += 0.02;
        moon.rotation.y += 0.01;
      }
      
      // Update asteroid belt - continuous rotation with scroll enhancement
      if (asteroidBelt.userData && asteroidBelt.userData.orbits) {
        const dummy = new THREE.Object3D();
        const orbits = asteroidBelt.userData.orbits;
        
        // Only update a subset of asteroids each frame for better performance
        const updateCount = Math.min(20, orbits.length);
        const startIdx = Math.floor(Math.random() * (orbits.length - updateCount));
        
        for (let i = 0; i < updateCount; i++) {
          const idx = (startIdx + i) % orbits.length;
          const orbitData = orbits[idx];
          
          // Continuous rotation with scroll enhancement
          const baseRotation = elapsedTime * orbitData.orbitSpeed * 0.2; // Continuous rotation
          const scrollEnhancement = scrollY * orbitData.orbitSpeed * 3; // Scroll enhancement
          const angle = orbitData.orbitAngle + baseRotation + scrollEnhancement;
          
          orbitData.orbitAngle = angle; // Save updated angle
          
          // Get current matrix
          asteroidBelt.getMatrixAt(idx, dummy.matrix);
          dummy.position.set(
            Math.cos(angle) * orbitData.orbitRadius,
            dummy.position.y,
            Math.sin(angle) * orbitData.orbitRadius
          );
          
          // Add some rotation to the asteroids themselves
          dummy.rotation.x = angle * 0.5;
          dummy.rotation.y = angle * 0.3;
          
          // Update matrix
          dummy.updateMatrix();
          asteroidBelt.setMatrixAt(idx, dummy.matrix);
        }
        
        // Update the instance matrix buffer
        asteroidBelt.instanceMatrix.needsUpdate = true;
      }
      
      // Rotate stars slowly
      stars.rotation.y = elapsedTime * 0.01;
      
      // Update planet labels - optimized to update less frequently
      // Only update labels every few frames for better performance
      if (Math.floor(elapsedTime * 10) % 3 === 0) {
        Object.values(labels).forEach(label => {
          if (label.userData && label.userData.planet) {
            const planet = label.userData.planet;
            const planetGroup = label.userData.planetGroup;
            
            // Get planet's world position
            const planetWorldPos = new THREE.Vector3();
            planet.getWorldPosition(planetWorldPos);
            
            // Position label above planet
            label.position.copy(planetWorldPos);
            label.position.y += 1;
            
            // Make label face camera
            label.lookAt(camera.position);
            
            // Simplified visibility check - just check distance
            const distanceToCamera = planetWorldPos.distanceTo(camera.position);
            label.visible = distanceToCamera < 25;
            
            // Scale label based on distance - simplified
            const scale = Math.max(1, 3 - distanceToCamera * 0.05);
            label.scale.set(scale, scale * 0.5, 1);
          }
        });
      }
      
      // Adjust camera based on mouse position
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 + 10 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
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
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 0,
        opacity: 0.8 // Slightly transparent to not distract from content
      }}
    />
  );
};

export default ThreeSolarSystem;