import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeHero = () => {
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
    
    // Create floating geometric shapes - reduced number for better performance
    const shapes = [];
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);
    
    // Create just 3 shapes instead of 5
    
    // Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(0.5, 0);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0x64ffda,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const ico = new THREE.Mesh(icoGeometry, icoMaterial);
    ico.position.set(-2, 1, -1);
    shapesGroup.add(ico);
    shapes.push(ico);
    
    // Octahedron
    const octGeometry = new THREE.OctahedronGeometry(0.4, 0);
    const octMaterial = new THREE.MeshBasicMaterial({
      color: 0x64ffda,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const oct = new THREE.Mesh(octGeometry, octMaterial);
    oct.position.set(2, 1, -1);
    shapesGroup.add(oct);
    shapes.push(oct);
    
    // Dodecahedron
    const dodecGeometry = new THREE.DodecahedronGeometry(0.35, 0);
    const dodecMaterial = new THREE.MeshBasicMaterial({
      color: 0x64ffda,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const dodec = new THREE.Mesh(dodecGeometry, dodecMaterial);
    dodec.position.set(0, -1, -1);
    shapesGroup.add(dodec);
    shapes.push(dodec);
    
    // Set animation properties for each shape
    shapes.forEach(shape => {
      shape.userData = {
        rotateX: Math.random() * 0.005 - 0.0025,
        rotateY: Math.random() * 0.005 - 0.0025,
        rotateZ: Math.random() * 0.005 - 0.0025,
        initialY: shape.position.y,
        initialX: shape.position.x
      };
    });
    
    // Create connecting lines between shapes - simplified
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x64ffda,
      transparent: true,
      opacity: 0.2
    });
    
    // Connect each shape to the next one in a loop
    for (let i = 0; i < shapes.length; i++) {
      const nextIndex = (i + 1) % shapes.length;
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        shapes[i].position,
        shapes[nextIndex].position
      ]);
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      linesGroup.add(line);
    }
    
    // Mouse interaction - simplified
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
    
    // Animation loop - simplified
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Rotate the entire scene slightly based on mouse position
      scene.rotation.y = mouseX * 0.05;
      scene.rotation.x = mouseY * 0.05;
      
      // Animate shapes with simple rotation
      shapes.forEach(shape => {
        if (shape.userData) {
          // Rotation
          shape.rotation.x += shape.userData.rotateX;
          shape.rotation.y += shape.userData.rotateY;
          shape.rotation.z += shape.userData.rotateZ;
        }
      });
      
      // Render scene
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
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      className="absolute top-0 left-0 w-full h-screen pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default ThreeHero;