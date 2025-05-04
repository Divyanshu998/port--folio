import React, { useEffect, useRef, useState } from 'react';

const BlockchainBackground = () => {
  const canvasRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let nodes = [];
    let connections = [];
    let blocks = []; // Blockchain blocks
    
    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 3; // Make canvas taller to cover scroll area
      initializeNodes();
    };
    
    // Initialize nodes
    const initializeNodes = () => {
      nodes = [];
      connections = [];
      blocks = [];
      
      // Create nodes
      const nodeCount = Math.floor(window.innerWidth * window.innerHeight / 20000);
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 2,
          color: '#64ffda',
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          connected: [],
          isSpecial: Math.random() > 0.85 // Some nodes are special (represent blockchain nodes)
        });
      }
      
      // Create connections
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const distance = Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
          );
          
          if (distance < 180) {
            connections.push({
              from: i,
              to: j,
              distance: distance,
              opacity: 1 - distance / 180,
              dataTransfer: Math.random() > 0.8, // Some connections transfer data
              dataPosition: 0,
              dataSpeed: Math.random() * 0.02 + 0.01
            });
            nodeA.connected.push(j);
            nodeB.connected.push(i);
          }
        }
      }
      
      // Create blockchain blocks
      const blockCount = 8;
      const blockSpacing = canvas.height / blockCount;
      
      for (let i = 0; i < blockCount; i++) {
        blocks.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 200,
          y: i * blockSpacing + blockSpacing / 2,
          width: 60 + Math.random() * 20,
          height: 40 + Math.random() * 10,
          connections: [],
          hash: Math.random().toString(16).substring(2, 10)
        });
        
        // Connect blocks in a chain
        if (i > 0) {
          blocks[i].connections.push(i - 1);
        }
      }
    };
    
    // Draw a blockchain block
    const drawBlock = (block, index) => {
      const scrollOffset = scrollY * 0.5;
      const y = block.y - scrollOffset;
      
      // Only draw if in viewport
      if (y < -100 || y > window.innerHeight + 100) return;
      
      // Calculate dynamic opacity based on scroll position
      const distanceFromCenter = Math.abs(y - window.innerHeight / 2);
      const maxDistance = window.innerHeight / 2;
      const opacity = Math.max(0.1, 1 - distanceFromCenter / maxDistance);
      
      // Draw block
      ctx.beginPath();
      ctx.rect(block.x - block.width / 2, y - block.height / 2, block.width, block.height);
      ctx.strokeStyle = `rgba(100, 255, 218, ${opacity * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Draw hash text
      ctx.font = '10px monospace';
      ctx.fillStyle = `rgba(100, 255, 218, ${opacity * 0.7})`;
      ctx.fillText(block.hash, block.x - 25, y + 5);
      
      // Draw block number
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = `rgba(100, 255, 218, ${opacity})`;
      ctx.fillText(`#${index}`, block.x - 10, y - 5);
      
      // Draw connections to previous blocks
      block.connections.forEach(connIndex => {
        const prevBlock = blocks[connIndex];
        const prevY = prevBlock.y - scrollOffset;
        
        // Draw connection line
        ctx.beginPath();
        ctx.moveTo(block.x, y - block.height / 2);
        ctx.lineTo(prevBlock.x, prevY + prevBlock.height / 2);
        
        // Animated dash effect
        ctx.setLineDash([4, 2]);
        ctx.lineDashOffset = -scrollY / 10;
        
        ctx.strokeStyle = `rgba(100, 255, 218, ${opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw data packet moving along the connection
        const packetProgress = (Date.now() / 1000) % 1;
        const packetX = prevBlock.x + (block.x - prevBlock.x) * packetProgress;
        const packetY = prevY + prevBlock.height / 2 + (y - prevBlock.height / 2 - prevY - prevBlock.height / 2) * packetProgress;
        
        ctx.beginPath();
        ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 255, 218, ${opacity})`;
        ctx.fill();
      });
    };
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update scroll position for animation
      const scrollFactor = scrollY / 500; // Adjust sensitivity
      
      // Draw connections
      connections.forEach(connection => {
        const nodeA = nodes[connection.from];
        const nodeB = nodes[connection.to];
        
        // Calculate positions with scroll offset
        const scrollOffsetA = nodeA.y - scrollY * 0.3;
        const scrollOffsetB = nodeB.y - scrollY * 0.3;
        
        // Only draw if in viewport
        if ((scrollOffsetA < -100 && scrollOffsetB < -100) || 
            (scrollOffsetA > window.innerHeight + 100 && scrollOffsetB > window.innerHeight + 100)) {
          return;
        }
        
        // Calculate dynamic opacity based on scroll
        let dynamicOpacity = connection.opacity * (0.5 + Math.sin(scrollFactor + connection.distance / 50) * 0.5);
        dynamicOpacity = Math.max(0.05, Math.min(0.6, dynamicOpacity));
        
        ctx.beginPath();
        ctx.moveTo(nodeA.x, scrollOffsetA);
        ctx.lineTo(nodeB.x, scrollOffsetB);
        
        // Different style for connections between special nodes (blockchain nodes)
        if (nodeA.isSpecial && nodeB.isSpecial) {
          ctx.strokeStyle = `rgba(100, 255, 218, ${dynamicOpacity * 1.5})`;
          ctx.lineWidth = 0.8;
          
          // Animated dash effect for blockchain connections
          ctx.setLineDash([5, 5]);
          ctx.lineDashOffset = -scrollY / 10;
        } else {
          ctx.strokeStyle = `rgba(100, 255, 218, ${dynamicOpacity})`;
          ctx.lineWidth = 0.5;
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw data transfer animation on some connections
        if (connection.dataTransfer) {
          connection.dataPosition += connection.dataSpeed;
          if (connection.dataPosition > 1) connection.dataPosition = 0;
          
          const dataX = nodeA.x + (nodeB.x - nodeA.x) * connection.dataPosition;
          const dataY = scrollOffsetA + (scrollOffsetB - scrollOffsetA) * connection.dataPosition;
          
          ctx.beginPath();
          ctx.arc(dataX, dataY, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 255, 218, ${dynamicOpacity * 2})`;
          ctx.fill();
        }
      });
      
      // Draw blockchain blocks
      blocks.forEach((block, index) => {
        drawBlock(block, index);
      });
      
      // Draw and update nodes
      nodes.forEach((node, index) => {
        // Calculate position with scroll offset
        const scrollOffset = node.y - scrollY * 0.3;
        
        // Only draw if in viewport
        if (scrollOffset < -50 || scrollOffset > window.innerHeight + 50) {
          return;
        }
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Add slight movement based on scroll
        node.x += Math.sin(scrollFactor + index) * 0.2;
        node.y += Math.cos(scrollFactor + index) * 0.2;
        
        // Boundary check
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, scrollOffset, node.radius, 0, Math.PI * 2);
        
        // Pulse effect based on scroll
        const pulseIntensity = 0.5 + Math.sin(scrollFactor + index / 5) * 0.5;
        const alpha = 0.3 + pulseIntensity * 0.7;
        
        // Special nodes (blockchain nodes) have different appearance
        if (node.isSpecial) {
          ctx.fillStyle = `rgba(100, 255, 218, ${alpha * 1.2})`;
          ctx.fill();
          
          // Draw outer ring for blockchain nodes
          ctx.beginPath();
          ctx.arc(node.x, scrollOffset, node.radius * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(100, 255, 218, ${alpha * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          
          // Draw inner details
          ctx.beginPath();
          ctx.arc(node.x, scrollOffset, node.radius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 255, 218, ${alpha * 1.5})`;
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(100, 255, 218, ${alpha})`;
          ctx.fill();
          
          // Highlight effect for some nodes
          if (index % 7 === 0) {
            ctx.beginPath();
            ctx.arc(node.x, scrollOffset, node.radius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 255, 218, ${alpha * 0.2})`;
            ctx.fill();
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Handle scroll events
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Initialize and start animation
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleResize();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollY]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.2 }}
    />
  );
};

export default BlockchainBackground;