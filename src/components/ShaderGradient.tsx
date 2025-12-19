import React from 'react';

interface ShaderGradientProps {
  className?: string;
  animate?: string;
  axesHelper?: string;
  bgColor1?: string;
  bgColor2?: string;
  brightness?: number;
  cAzimuthAngle?: number;
  cDistance?: number;
  cPolarAngle?: number;
  cameraZoom?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  destination?: string;
  embedMode?: string;
  envPreset?: string;
  format?: string;
  fov?: number;
  frameRate?: number;
  gizmoHelper?: string;
  grain?: string;
  lightType?: string;
  pixelDensity?: number;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  range?: string;
  rangeEnd?: number;
  rangeStart?: number;
  reflection?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  shader?: string;
  type?: string;
  uAmplitude?: number;
  uDensity?: number;
  uFrequency?: number;
  uSpeed?: number;
  uStrength?: number;
  uTime?: number;
  wireframe?: boolean;
  [key: string]: any;
}

// Try to dynamically import ShaderGradient from various possible libraries
let ShaderGradientComponent: React.ComponentType<any> | null = null;

// Try importing from @shadergradient/react
try {
  const shaderGradientLib = require('@shadergradient/react');
  ShaderGradientComponent = shaderGradientLib.ShaderGradient || shaderGradientLib.default || shaderGradientLib;
} catch (e) {
  // Try other possible package names
  try {
    const shaderGradientLib2 = require('shadergradient');
    ShaderGradientComponent = shaderGradientLib2.ShaderGradient || shaderGradientLib2.default || shaderGradientLib2;
  } catch (e2) {
    // Component not found, will use fallback
  }
}

export const ShaderGradient: React.FC<ShaderGradientProps> = ({ 
  className = '',
  animate = "on",
  axesHelper = "off",
  bgColor1 = "#000000",
  bgColor2 = "#000000",
  brightness = 1.2,
  cAzimuthAngle = 180,
  cDistance = 2.9,
  cPolarAngle = 120,
  cameraZoom = 1,
  color1 = "#000dff",
  color2 = "#2866f8",
  color3 = "#4fa1ff",
  destination = "onCanvas",
  embedMode = "off",
  envPreset = "city",
  format = "gif",
  fov = 45,
  frameRate = 10,
  gizmoHelper = "hide",
  grain = "off",
  lightType = "3d",
  pixelDensity = 1,
  positionX = 0,
  positionY = 1.8,
  positionZ = 0,
  range = "disabled",
  rangeEnd = 40,
  rangeStart = 0,
  reflection = 0.1,
  rotationX = 0,
  rotationY = 0,
  rotationZ = -90,
  shader = "defaults",
  type = "waterPlane",
  uAmplitude = 0,
  uDensity = 1.6,
  uFrequency = 5.5,
  uSpeed = 0.3,
  uStrength = 3,
  uTime = 0.2,
  wireframe = false,
  ...props 
}) => {
  // If ShaderGradient component is available, use it
  if (ShaderGradientComponent) {
    return (
      <ShaderGradientComponent
        className={className}
        animate={animate}
        axesHelper={axesHelper}
        bgColor1={bgColor1}
        bgColor2={bgColor2}
        brightness={brightness}
        cAzimuthAngle={cAzimuthAngle}
        cDistance={cDistance}
        cPolarAngle={cPolarAngle}
        cameraZoom={cameraZoom}
        color1={color1}
        color2={color2}
        color3={color3}
        destination={destination}
        embedMode={embedMode}
        envPreset={envPreset}
        format={format}
        fov={fov}
        frameRate={frameRate}
        gizmoHelper={gizmoHelper}
        grain={grain}
        lightType={lightType}
        pixelDensity={pixelDensity}
        positionX={positionX}
        positionY={positionY}
        positionZ={positionZ}
        range={range}
        rangeEnd={rangeEnd}
        rangeStart={rangeStart}
        reflection={reflection}
        rotationX={rotationX}
        rotationY={rotationY}
        rotationZ={rotationZ}
        shader={shader}
        type={type}
        uAmplitude={uAmplitude}
        uDensity={uDensity}
        uFrequency={uFrequency}
        uSpeed={uSpeed}
        uStrength={uStrength}
        uTime={uTime}
        wireframe={wireframe}
        {...props}
      />
    );
  }

  // Fallback: Create an animated gradient background that mimics the shader effect
  return (
    <div 
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`,
        backgroundSize: '200% 200%',
        animation: animate === 'on' ? 'gradientShift 8s ease infinite' : 'none',
      }}
    >
      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
      {/* Add some animated overlay for depth */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${color2} 0%, transparent 50%),
                       radial-gradient(circle at 70% 50%, ${color3} 0%, transparent 50%)`,
          animation: animate === 'on' ? 'pulse 4s ease-in-out infinite' : 'none',
        }}
      />
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};
