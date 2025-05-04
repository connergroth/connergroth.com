import p5 from 'p5';
import vertSrc from '../shaders/shader.vert?raw';
import fragSrc from '../shaders/shader.frag?raw';
import { useEffect, useRef } from 'react';

interface BlobShaderProps {
  size?: number; // Size percentage (100 = full screen, 50 = half size)
  opacity?: number; // Opacity of the blob
  position?: 'hero' | 'footer' | 'mini'; // Position of the blob
  fixed?: boolean; // Whether the blob should stay fixed during scrolling
  extend?: boolean; // Whether to extend the blob beyond its container
  height?: string; // Custom height for the container
  className?: string; // Additional classes
}

export default function BlobShader({ 
  size = 60, 
  opacity = 0.7, 
  position = 'hero', 
  fixed = false,
  extend = false,
  height,
  className = ''
}: BlobShaderProps) {
  // Use a ref to track and clean up the p5 instance
  const instanceRef = useRef<p5 | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Clean up any existing p5 instance first to prevent duplicates
    if (instanceRef.current) {
      instanceRef.current.remove();
      instanceRef.current = null;
    }
    
    const sketch = (p: p5) => {
      let theShader: p5.Shader | null = null;
      let time = p.random(0, p.TWO_PI);
      let drag = false, prevX = 0, prevY = 0, manual = 0;
      const sizeScale = size / 100; // Convert percentage to scale factor
      
      // Store initial window dimensions to prevent resize issues
      const initialWidth = window.innerWidth;
      const initialHeight = window.innerHeight;

      p.setup = () => {
        // Create canvas
        const canvas = p.createCanvas(initialWidth, initialHeight, p.WEBGL);
        
        // Set canvas positioning based on fixed prop
        const canvasElement = canvas.elt;
        
        // Apply position styling
        if (fixed) {
          canvasElement.style.position = 'fixed';
          canvasElement.style.top = '0';
          canvasElement.style.left = '0';
          canvasElement.style.width = '100%';
          canvasElement.style.height = '100%';
        } else {
          canvasElement.style.position = 'absolute';
          canvasElement.style.top = '0';
          canvasElement.style.left = '0';
          canvasElement.style.width = '100%';
          canvasElement.style.height = '100%';
        }
        
        // Common styling
        canvasElement.style.pointerEvents = 'none';
        canvasElement.style.zIndex = '0';
        
        // Position-specific styling
        if (position === 'hero') {
          canvasElement.classList.add('blob-hero');
          if (extend) {
            canvasElement.classList.add('blob-extend');
          }
        } else if (position === 'footer') {
          canvasElement.classList.add('blob-footer');
        } else if (position === 'mini') {
          canvasElement.classList.add('blob-mini');
        }
        
        // Add fixed or static class
        canvasElement.classList.add(fixed ? 'blob-fixed' : 'blob-static');
        
        p.pixelDensity(0.75); // Lower resolution for better performance
        p.noStroke();
        
        try {
          // Create shader
          theShader = p.createShader(vertSrc, fragSrc);
        } catch (err) {
          console.error('Failed to create shader:', err);
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };

      p.mousePressed = () => {
        if (p.windowWidth < 640) return;
        drag = true; 
        prevX = p.mouseX; 
        prevY = p.mouseY;
      };
      
      p.mouseReleased = () => { 
        drag = false; 
      };

      p.draw = () => {
        // Clear the canvas with transparency
        p.clear();
        
        // Only proceed if shader is loaded
        if (!theShader) return;
        
        // Update animation
        if (drag) {
          const dx = p.mouseX - prevX, dy = p.mouseY - prevY;
          manual += p.atan2(dy, dx) * 0.01;
          prevX = p.mouseX; prevY = p.mouseY;
        } else {
          time += 20 / ((p.frameRate() || 60) * 140);
          if (time > p.TWO_PI) time -= p.TWO_PI;
        }
        
        const pow = p.map(p.sin(time), -1, 1, 6, 12);
        
        // Apply the shader
        p.shader(theShader);
        
        // Set uniforms
        theShader.setUniform('iAngle', time + manual);
        theShader.setUniform('iTime', p.millis() / 1000);
        theShader.setUniform('iPower', pow);
        theShader.setUniform('iResolution', [p.width, p.height]);
        theShader.setUniform('iOpacity', opacity);
        
        // Draw a scaled rectangle in the center of the canvas
        p.push();
        p.translate(0, 0, 0); // Center of canvas
        const rectWidth = p.width * sizeScale;
        const rectHeight = p.height * sizeScale;
        p.rect(-rectWidth/2, -rectHeight/2, rectWidth, rectHeight);
        p.pop();
      };
    };
    
    // Create and store the p5 instance
    instanceRef.current = new p5(sketch);
    
    // Clean up function
    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [size, opacity, position, fixed, extend]);
  
  // Create a div container with appropriate styling
  return (
    <div 
      ref={containerRef}
      className={`blob-container ${className} ${position === 'mini' ? 'blob-mini-container' : ''}`}
      style={{ 
        height: height || (position === 'mini' ? '100%' : 'auto'),
        position: 'relative',
        overflow: extend ? 'visible' : 'hidden',
        zIndex: 0
      }}
    />
  );
}