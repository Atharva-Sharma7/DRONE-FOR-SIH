'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function PotreeViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup Three.js scene to simulate point cloud
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a'); // Dark theme bg

    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 50, 50);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);

    // Add Grid
    const gridHelper = new THREE.GridHelper(100, 100, 0x334155, 0x334155);
    scene.add(gridHelper);

    // Generate simulated point cloud (50,000 points)
    const particleCount = 50000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#8b5a2b'); // brown (ground)
    const color2 = new THREE.Color('#1a9850'); // green (vegetation)
    const color3 = new THREE.Color('#f46d43'); // high ground (orange/red)

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      
      // Terrain elevation formula (perlin-noise like simulation)
      let y = Math.sin(x/10) * 2 + Math.cos(z/10) * 2;
      
      let isVeg = Math.random() > 0.6;
      if (isVeg) {
        y += Math.random() * 2 + 0.5; // add plant height
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      let c = new THREE.Color();
      if (isVeg) {
        c.copy(color2).multiplyScalar(0.5 + Math.random() * 0.5); // vary green
      } else {
        if (y < -1) {
          c.setHex(0x1e3a8a); // water pooling area (blue)
        } else if (y > 2) {
          c.copy(color3);
        } else {
          c.copy(color1);
        }
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    setLoading(false);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-l-xl overflow-hidden bg-slate-900 border-r border-slate-700">
      <div ref={containerRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
          <span className="text-white font-medium">Loading Point Cloud...</span>
        </div>
      )}
      <div className="absolute bottom-4 left-4 text-xs text-slate-400 bg-slate-900/80 px-2 py-1 rounded">
        Scroll to zoom, drag to pan
      </div>
    </div>
  );
}
