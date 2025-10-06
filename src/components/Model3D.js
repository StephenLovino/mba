import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import './Model3D.css';

function Model({ scrollY }) {
  const modelRef = useRef();
  const [modelError, setModelError] = useState(false);

  // Always call the hook unconditionally
  const gltfScene = useGLTF('/3dmodels/mba_mascot_blue.glb');

  // Handle loading errors
  useEffect(() => {
    if (gltfScene && gltfScene.error) {
      console.log('GLTF model loading error:', gltfScene.error);
      setModelError(true);
    }
  }, [gltfScene]);

  useFrame(() => {
    if (modelRef.current) {
      // Rotate based on scroll position
      modelRef.current.rotation.y = scrollY * 0.01; // Adjust multiplier for rotation speed
      modelRef.current.rotation.x = Math.sin(scrollY * 0.005) * 0.1; // Subtle bobbing motion
    }
  });

  // Check if the model loaded successfully
  if (modelError || !gltfScene || !gltfScene.scene) {
    // Fallback to geometric shapes if GLTF fails
    return (
      <group ref={modelRef} position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial 
            color="#667eea" 
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color="#764ba2" 
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.3, 8]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>
      </group>
    );
  }

  return (
    <primitive 
      ref={modelRef} 
      object={gltfScene.scene} 
      scale={[2, 2, 2]} 
      position={[0, -1, 0]}
    />
  );
}

// Error boundary component for 3D model
function ModelErrorFallback() {
  return (
    <div className="model-error-fallback">
      <div className="error-content">
        <h3>3D Model Loading...</h3>
        <p>Please wait while we load the interactive 3D mascot</p>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
}

function Model3D() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleModelLoad = () => {
    setIsLoading(false);
  };

  const handleModelError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  if (hasError) {
    return <ModelErrorFallback />;
  }

  return (
    <div className="model-container">
      <div className="model-overlay"></div>
      <div className="model-title">MBA Mascot</div>
      <div className="model-subtitle">Scroll to see me rotate!</div>
      {isLoading && (
        <div className="model-loading">
          <div className="loading-spinner"></div>
          <p>Loading MBA Mascot...</p>
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        onCreated={handleModelLoad}
        onError={handleModelError}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-10, -10, -5]} intensity={0.8} />
          <spotLight 
            position={[0, 10, 0]} 
            angle={0.3} 
            penumbra={1} 
            intensity={1}
            castShadow
          />
          <Model scrollY={scrollY} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Model3D;
