import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDAnimationProps {
  className?: string;
}

const ThreeDAnimation = ({ className = '' }: ThreeDAnimationProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create Egyptian-themed 3D objects
    const objects: THREE.Object3D[] = [];

    // Golden pyramid
    const pyramidGeometry = new THREE.ConeGeometry(1, 1.5, 4);
    const pyramidMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf59e0b,
      shininess: 100 
    });
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    pyramid.position.set(-2, 0, 0);
    pyramid.castShadow = true;
    scene.add(pyramid);
    objects.push(pyramid);

    // Emerald crystal
    const crystalGeometry = new THREE.OctahedronGeometry(0.8);
    const crystalMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x10b981,
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    crystal.position.set(2, 0, 0);
    crystal.castShadow = true;
    scene.add(crystal);
    objects.push(crystal);

    // Rotating torus (representing traditional Egyptian jewelry)
    const torusGeometry = new THREE.TorusGeometry(0.8, 0.3, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xd97706,
      shininess: 100 
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(0, 1.5, 0);
    torus.castShadow = true;
    scene.add(torus);
    objects.push(torus);

    // Create floating particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate objects
      objects.forEach((obj, index) => {
        obj.rotation.y += 0.01 * (index + 1);
        obj.rotation.x += 0.005 * (index + 1);
        
        // Add floating motion
        obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
      });

      // Animate particles
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-64 rounded-lg overflow-hidden ${className}`}
      style={{ minHeight: '250px' }}
    />
  );
};

export default ThreeDAnimation;