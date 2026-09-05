'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sliders, Layers, Eye, RefreshCw, AlertTriangle, Droplets, TrendingDown } from 'lucide-react';

export type LidarColorMode = 'dem' | 'ndvi' | 'slope' | 'intensity';

export function PotreeViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  const [loading, setLoading] = useState(true);
  const [colorMode, setColorMode] = useState<LidarColorMode>('ndvi');
  const [pointDensity, setPointDensity] = useState<number>(50000);
  const [showContours, setShowContours] = useState(true);
  const [showLevelingPins, setShowLevelingPins] = useState(true);

  // Generate 3D point cloud with selected color mode & point count
  const generatePointCloud = useCallback((mode: LidarColorMode, count: number) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Color definitions
    const cSoil = new THREE.Color('#3A2A1A');       // Dark vertisol brown
    const cCanopy = new THREE.Color('#4A7C42');     // Dense green
    const cMildGreen = new THREE.Color('#84cc16');   // Mild vegetation
    const cWater = new THREE.Color('#2563eb');      // Water pooling blue
    const cHighLand = new THREE.Color('#E8C84A');   // Gold high land
    const cSlopeRed = new THREE.Color('#C4531A');   // Slope risk rust-red

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;

      // Realistic terrain elevation formula (dem)
      let y = Math.sin(x / 12) * 2.5 + Math.cos(z / 12) * 2.5;

      const isVeg = Math.random() > 0.55;
      if (isVeg) {
        y += Math.random() * 2.2 + 0.5; // Crop canopy height
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      let c = new THREE.Color();

      if (mode === 'ndvi') {
        // NDVI Vegetation Density Color Mode
        if (isVeg) {
          c.copy(Math.random() > 0.4 ? cCanopy : cMildGreen).multiplyScalar(0.7 + Math.random() * 0.4);
        } else {
          c.copy(y < -1 ? cWater : cSoil);
        }
      } else if (mode === 'dem') {
        // DEM Elevation Height Map Mode
        if (y < -1.2) {
          c.copy(cWater);
        } else if (y < 0.5) {
          c.copy(cCanopy);
        } else if (y < 2.5) {
          c.copy(cMildGreen);
        } else {
          c.copy(cHighLand);
        }
      } else if (mode === 'slope') {
        // Slope Gradient Risk Mode
        const slopeMag = Math.abs(Math.cos(x / 12) + Math.sin(z / 12));
        if (slopeMag > 1.2) {
          c.copy(cSlopeRed); // Steep slope risk
        } else if (slopeMag > 0.7) {
          c.copy(cHighLand);
        } else {
          c.copy(cCanopy);
        }
      } else {
        // Laser Intensity Reflectivity Mode (Grayscale + IR highlights)
        const intensity = (y + 5) / 10;
        c.setRGB(intensity, intensity, intensity);
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#17160F'); // Vertisol background

    const camera = new THREE.PerspectiveCamera(55, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 45, 55);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);

    // Add Grid Helper
    if (showContours) {
      const gridHelper = new THREE.GridHelper(100, 50, 0x3A3928, 0x2E2D22);
      gridHelper.position.y = -3;
      scene.add(gridHelper);
    }

    // Add Leveling Error 3D Pin Beacons
    if (showLevelingPins) {
      const pinCoords = [
        { x: -15, y: -2, z: 10, color: 0xef4444, label: 'Water Pooling' },
        { x: 20, y: 3, z: -12, color: 0xf59e0b, label: '3.2° Slope Risk' },
        { x: 5, y: 4, z: 18, color: 0x3b82f6, label: 'Elevation Mound' },
      ];

      pinCoords.forEach(p => {
        // Pin Beacon Mesh
        const coneGeom = new THREE.ConeGeometry(1.5, 5, 8);
        const coneMat = new THREE.MeshBasicMaterial({ color: p.color, wireframe: true });
        const cone = new THREE.Mesh(coneGeom, coneMat);
        cone.position.set(p.x, p.y + 2.5, p.z);
        cone.rotation.x = Math.PI;
        scene.add(cone);

        // Ground Target Ring
        const ringGeom = new THREE.RingGeometry(1, 3, 16);
        const ringMat = new THREE.MeshBasicMaterial({ color: p.color, side: THREE.DoubleSide, opacity: 0.5, transparent: true });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.position.set(p.x, p.y, p.z);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);
      });
    }

    // Create Initial Point Cloud
    const geometry = generatePointCloud(colorMode, pointDensity);
    const material = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);

    setLoading(false);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [colorMode, pointDensity, showContours, showLevelingPins, generatePointCloud]);

  return (
    <div className="relative w-full h-full rounded-l-xl overflow-hidden bg-[#17160F] border-r border-[var(--border)] font-sans">
      <div ref={containerRef} className="w-full h-full" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#17160F]/90 backdrop-blur-sm z-50">
          <div className="flex items-center gap-3 bg-[var(--surface)] px-4 py-3 rounded-xl border border-[var(--border)]">
            <RefreshCw className="w-5 h-5 text-[var(--accent)] animate-spin" />
            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">Generating LiDAR 3D Surface...</span>
          </div>
        </div>
      )}

      {/* LiDAR Variations & Control Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 w-64 bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] p-3 rounded-xl shadow-2xl text-xs">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
          <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)] font-mono">
            <Layers className="w-4 h-4 text-[var(--accent)]" />
            <span>LiDAR Scan Mode</span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">{pointDensity.toLocaleString()} pts</span>
        </div>

        {/* Color Mode Options */}
        <div className="grid grid-cols-2 gap-1 pt-1">
          {[
            { id: 'ndvi' as const, label: '🟢 NDVI Canopy' },
            { id: 'dem' as const, label: '🔵 DEM Elevation' },
            { id: 'slope' as const, label: '🔴 Slope Gradient' },
            { id: 'intensity' as const, label: '⚪ Intensity Reflect' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setColorMode(m.id)}
              className={`py-1.5 px-2 rounded font-mono text-[10px] text-left border transition-colors ${
                colorMode === m.id
                  ? 'bg-[var(--accent)] text-black font-bold border-[var(--accent)]'
                  : 'bg-[var(--background)] hover:bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Point Density Control */}
        <div className="pt-2 border-t border-[var(--border)] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span>Point Density:</span>
            <span className="text-[var(--text-primary)] font-bold">{pointDensity / 1000}k points</span>
          </div>
          <input
            type="range"
            min="10000"
            max="100000"
            step="10000"
            value={pointDensity}
            onChange={(e) => setPointDensity(parseInt(e.target.value))}
            className="w-full accent-[var(--accent)] h-1 bg-[var(--background)] rounded cursor-pointer"
          />
        </div>

        {/* Display Toggles */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[10px] font-mono">
          <button
            onClick={() => setShowContours(!showContours)}
            className={`px-2 py-1 rounded border transition-colors ${
              showContours ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' : 'bg-[var(--background)] text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            Grid Contours
          </button>

          <button
            onClick={() => setShowLevelingPins(!showLevelingPins)}
            className={`px-2 py-1 rounded border transition-colors ${
              showLevelingPins ? 'bg-amber-600/20 text-amber-400 border-amber-500/40' : 'bg-[var(--background)] text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            Leveling 3D Pins
          </button>
        </div>
      </div>

      {/* Viewer Instructions HUD */}
      <div className="absolute bottom-4 left-4 z-20 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface)]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[var(--border)]">
        🖱️ Rotate: Drag | Pan: Right-Click | Zoom: Scroll
      </div>
    </div>
  );
}
