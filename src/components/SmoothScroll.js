import React, { useEffect, useRef } from 'react';

const SmoothScroll = ({ children }) => {
  // Refs for scroll elements
  const scrollingContainerRef = useRef(null);
  const smoothScrollingRef = useRef(null);
  
  // Scroll animation variables
  const data = useRef({
    ease: 0.075, // Smoother easing
    current: 0,
    previous: 0,
    rounded: 0,
    windowHeight: 0,
    scrollHeight: 0,
    rafId: null,
    resizeObserver: null
  });

  // Initialize scroll values
  useEffect(() => {
    // Set initial values
    setBodyHeight();
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Create ResizeObserver to handle content changes
    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to avoid ResizeObserver loop errors
      requestAnimationFrame(() => {
        setBodyHeight();
      });
    });
    
    if (smoothScrollingRef.current) {
      resizeObserver.observe(smoothScrollingRef.current);
    }
    
    data.current.resizeObserver = resizeObserver;
    
    // Start animation
    data.current.rafId = requestAnimationFrame(smoothScrolling);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(data.current.rafId);
      
      if (data.current.resizeObserver) {
        data.current.resizeObserver.disconnect();
      }
    };
  }, []);

  // Set the body height to enable scrolling
  const setBodyHeight = () => {
    if (!smoothScrollingRef.current) return;
    
    try {
      data.current.windowHeight = window.innerHeight;
      data.current.scrollHeight = smoothScrollingRef.current.getBoundingClientRect().height;
      
      // Only update if there's a significant change to avoid unnecessary reflows
      const currentHeight = parseInt(document.body.style.height, 10) || 0;
      if (Math.abs(currentHeight - data.current.scrollHeight) > 5) {
        document.body.style.height = `${data.current.scrollHeight}px`;
      }
    } catch (error) {
      console.warn('Error in setBodyHeight:', error);
    }
  };

  // Handle scroll events
  const handleScroll = () => {
    data.current.current = window.scrollY;
  };

  // Smooth scrolling animation
  const smoothScrolling = () => {
    try {
      if (!smoothScrollingRef.current) {
        data.current.rafId = requestAnimationFrame(smoothScrolling);
        return;
      }
      
      // Calculate scroll position with easing
      data.current.previous += (data.current.current - data.current.previous) * data.current.ease;
      data.current.rounded = Math.round(data.current.previous * 100) / 100;
      
      // Apply transform to create smooth scroll effect
      // Only update transform if there's a significant change to reduce reflows
      const currentTransform = smoothScrollingRef.current.style.transform;
      const newTransform = `translateY(-${data.current.rounded}px)`;
      
      if (currentTransform !== newTransform) {
        smoothScrollingRef.current.style.transform = newTransform;
      }
    } catch (error) {
      console.warn('Error in smoothScrolling:', error);
    }
    
    // Continue animation
    data.current.rafId = requestAnimationFrame(smoothScrolling);
  };

  // Handle navigation links for smooth scrolling
  useEffect(() => {
    const handleLinkClick = (e) => {
      const navLinks = document.querySelectorAll('a[href^="#"]');
      
      navLinks.forEach(link => {
        if (link === e.target) {
          e.preventDefault();
          
          const targetId = link.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    };
    
    document.addEventListener('click', handleLinkClick);
    
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  return (
    <div className="smooth-scroll" ref={scrollingContainerRef}>
      <div className="smooth-scroll__content" ref={smoothScrollingRef}>
        {children}
      </div>
    </div>
  );
};

export default SmoothScroll;