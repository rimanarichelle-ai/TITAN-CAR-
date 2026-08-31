"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Sparkles, Eye, Sun, Moon, RotateCcw, Zap } from "lucide-react";
import Image from "next/image";

interface Automotive3DHeroProps {
  onInteract?: () => void;
  accentColor?: string;
}

const CAR_COLORS = [
  { name: "Rouge Titan (Signature)", hex: "#C62828", threeHex: 0xc62828, desc: "Rouge Métallisé Officiel" },
  { name: "Gris Nardo Sport", hex: "#7D8388", threeHex: 0x7d8388, desc: "Gris Minéral R-Line" },
  { name: "Noir Obsidienne", hex: "#151518", threeHex: 0x151518, desc: "Noir Métallisé Profond" },
  { name: "Blanc Nacré Arctique", hex: "#F0F0F5", threeHex: 0xf0f0f5, desc: "Blanc Perlé Triple Couche" },
  { name: "Gris Minéral Carbon", hex: "#3A3D40", threeHex: 0x3a3d40, desc: "Gris Graphite Anthracite" },
];

export default function Automotive3DHero({ accentColor = "#C62828" }: Automotive3DHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isHeadlightsOn, setIsHeadlightsOn] = useState(true);
  const [lightingMode, setLightingMode] = useState<"gold" | "studio" | "cyber">("gold");
  const [isRotating, setIsRotating] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // References to 3D scene elements for dynamic updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const carBodyMeshRef = useRef<THREE.Mesh[]>([]);
  const headlightsLightsRef = useRef<THREE.SpotLight[]>([]);
  const headlightsMeshRef = useRef<THREE.Mesh[]>([]);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Check reduced motion and WebGL support on mount
  useEffect(() => {
    let isSubscribed = true;
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const checkSupport = () => {
        if (!isSubscribed) return;
        const reduced = mediaQuery.matches;
        setPrefersReducedMotion(reduced);
        try {
          const canvas = document.createElement("canvas");
          const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
          const isMobile = window.innerWidth < 768;
          if (gl && !reduced && (!isMobile || window.innerWidth >= 640)) {
            setIsSupported(true);
          } else {
            setIsSupported(false);
          }
        } catch {
          setIsSupported(false);
        }
      };

      checkSupport();
      const listener = () => checkSupport();
      mediaQuery.addEventListener("change", listener);
      window.addEventListener("resize", listener);
      return () => {
        isSubscribed = false;
        mediaQuery.removeEventListener("change", listener);
        window.removeEventListener("resize", listener);
      };
    }
  }, []);

  // Build Procedural High-Detail Luxury Car Model
  const createLuxuryCarModel = useCallback((colorHex: number): THREE.Group => {
    const carGroup = new THREE.Group();
    carBodyMeshRef.current = [];
    wheelsRef.current = [];
    headlightsLightsRef.current = [];
    headlightsMeshRef.current = [];

    // Materials
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: colorHex,
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
    });

    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.6,
      metalness: 0.3,
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.05,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x101520,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
    });

    const darkInteriorMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.8,
    });

    // 1. Lower Chassis & Underbody
    const chassisGeo = new THREE.BoxGeometry(2.1, 0.4, 4.4);
    const chassis = new THREE.Mesh(chassisGeo, bodyMaterial);
    chassis.position.y = 0.5;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    carGroup.add(chassis);
    carBodyMeshRef.current.push(chassis);

    // 2. Aerodynamic Cabin / Greenhouse (Upper Body)
    const cabinGeo = new THREE.BoxGeometry(1.8, 0.55, 2.3);
    const cabin = new THREE.Mesh(cabinGeo, bodyMaterial);
    cabin.position.set(0, 0.9, -0.15);
    cabin.castShadow = true;
    carGroup.add(cabin);
    carBodyMeshRef.current.push(cabin);

    // 3. Windshield & Windows
    const windshieldGeo = new THREE.BoxGeometry(1.72, 0.48, 0.05);
    const windshield = new THREE.Mesh(windshieldGeo, glassMaterial);
    windshield.position.set(0, 0.92, 0.98);
    windshield.rotation.x = -0.55;
    carGroup.add(windshield);

    const rearGlass = new THREE.Mesh(windshieldGeo, glassMaterial);
    rearGlass.position.set(0, 0.92, -1.25);
    rearGlass.rotation.x = 0.55;
    carGroup.add(rearGlass);

    // Side windows
    const sideWindowGeo = new THREE.BoxGeometry(0.04, 0.4, 1.8);
    const leftWindow = new THREE.Mesh(sideWindowGeo, glassMaterial);
    leftWindow.position.set(-0.89, 0.9, -0.15);
    carGroup.add(leftWindow);

    const rightWindow = new THREE.Mesh(sideWindowGeo, glassMaterial);
    rightWindow.position.set(0.89, 0.9, -0.15);
    carGroup.add(rightWindow);

    // 4. Hood & Front Nose Slope
    const hoodGeo = new THREE.BoxGeometry(1.95, 0.25, 1.25);
    const hood = new THREE.Mesh(hoodGeo, bodyMaterial);
    hood.position.set(0, 0.62, 1.45);
    hood.rotation.x = -0.06;
    hood.castShadow = true;
    carGroup.add(hood);
    carBodyMeshRef.current.push(hood);

    // Front Grille
    const grilleGeo = new THREE.BoxGeometry(1.4, 0.22, 0.1);
    const grille = new THREE.Mesh(grilleGeo, carbonMaterial);
    grille.position.set(0, 0.45, 2.2);
    carGroup.add(grille);

    // 5. LED Headlights & Taillights
    const headlightGeo = new THREE.BoxGeometry(0.35, 0.1, 0.15);
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xddeeff,
      emissiveIntensity: 3.5,
      roughness: 0.1,
    });

    const leftHeadlight = new THREE.Mesh(headlightGeo, headlightMat);
    leftHeadlight.position.set(-0.75, 0.55, 2.18);
    carGroup.add(leftHeadlight);
    headlightsMeshRef.current.push(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeo, headlightMat);
    rightHeadlight.position.set(0.75, 0.55, 2.18);
    carGroup.add(rightHeadlight);
    headlightsMeshRef.current.push(rightHeadlight);

    // Spotlight beams for realistic headlights
    const leftSpot = new THREE.SpotLight(0xeef6ff, 4.0, 10, Math.PI / 6, 0.4, 1.2);
    leftSpot.position.set(-0.75, 0.55, 2.2);
    leftSpot.target.position.set(-0.75, 0, 8);
    carGroup.add(leftSpot);
    carGroup.add(leftSpot.target);
    headlightsLightsRef.current.push(leftSpot);

    const rightSpot = new THREE.SpotLight(0xeef6ff, 4.0, 10, Math.PI / 6, 0.4, 1.2);
    rightSpot.position.set(0.75, 0.55, 2.2);
    rightSpot.target.position.set(0.75, 0, 8);
    carGroup.add(rightSpot);
    carGroup.add(rightSpot.target);
    headlightsLightsRef.current.push(rightSpot);

    // Taillight Bar (Full-width LED Matrix)
    const taillightGeo = new THREE.BoxGeometry(1.8, 0.08, 0.05);
    const taillightMat = new THREE.MeshStandardMaterial({
      color: 0xff1122,
      emissive: 0xff0022,
      emissiveIntensity: 4.0,
      roughness: 0.2,
    });
    const taillightBar = new THREE.Mesh(taillightGeo, taillightMat);
    taillightBar.position.set(0, 0.65, -2.2);
    carGroup.add(taillightBar);

    // 6. Wheels (4 Alloy Rims with Tire Geometries)
    const wheelPositions = [
      { x: -1.02, y: 0.35, z: 1.35 },
      { x: 1.02, y: 0.35, z: 1.35 },
      { x: -1.02, y: 0.35, z: -1.35 },
      { x: 1.02, y: 0.35, z: -1.35 },
    ];

    const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 24);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.85 });

    const rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.26, 12);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.9, roughness: 0.1 });

    const caliperGeo = new THREE.BoxGeometry(0.1, 0.16, 0.12);
    const caliperMat = new THREE.MeshStandardMaterial({ color: 0xc59b27, metalness: 0.8, roughness: 0.2 });

    wheelPositions.forEach((pos) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      const caliper = new THREE.Mesh(caliperGeo, caliperMat);
      caliper.position.set(pos.x > 0 ? -0.05 : 0.05, 0.1, 0);
      wheelGroup.add(caliper);

      carGroup.add(wheelGroup);
      wheelsRef.current.push(wheelGroup);
    });

    // 7. Roof Rails & Rear Diffuser
    const diffuserGeo = new THREE.BoxGeometry(1.6, 0.15, 0.3);
    const diffuser = new THREE.Mesh(diffuserGeo, carbonMaterial);
    diffuser.position.set(0, 0.25, -2.15);
    carGroup.add(diffuser);

    // Quad Exhaust Pipes
    const exhaustGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.15, 12);
    [-0.55, -0.45, 0.45, 0.55].forEach((x) => {
      const exhaust = new THREE.Mesh(exhaustGeo, chromeMaterial);
      exhaust.rotation.x = Math.PI / 2;
      exhaust.position.set(x, 0.22, -2.25);
      carGroup.add(exhaust);
    });

    // Side Mirrors
    const mirrorGeo = new THREE.BoxGeometry(0.2, 0.1, 0.12);
    const leftMirror = new THREE.Mesh(mirrorGeo, bodyMaterial);
    leftMirror.position.set(-1.05, 0.85, 0.8);
    carGroup.add(leftMirror);
    carBodyMeshRef.current.push(leftMirror);

    const rightMirror = new THREE.Mesh(mirrorGeo, bodyMaterial);
    rightMirror.position.set(1.05, 0.85, 0.8);
    carGroup.add(rightMirror);
    carBodyMeshRef.current.push(rightMirror);

    return carGroup;
  }, []);

  // Initialize WebGL Scene
  useEffect(() => {
    if (!isSupported || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0e0e11);
    scene.fog = new THREE.FogExp2(0x0e0e11, 0.07);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(4.5, 2.2, 5.5);
    camera.lookAt(0, 0.6, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // 4. Studio Lighting
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    // Main Studio Softbox Light
    const mainLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    mainLight.position.set(5, 8, 4);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 25;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    // Rim Contour Light (Luxury Gold)
    const rimLight = new THREE.DirectionalLight(0xc59b27, 2.0);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Top Overhead Light
    const overheadLight = new THREE.DirectionalLight(0xddeeff, 1.2);
    overheadLight.position.set(0, 8, 0);
    scene.add(overheadLight);

    // 5. Showroom Floor & Contact Shadow
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x121216,
      roughness: 0.25,
      metalness: 0.75,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Circular Studio Stage Ring
    const ringGeo = new THREE.RingGeometry(2.8, 2.85, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc59b27,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    // 6. Build Car Model
    const carModel = createLuxuryCarModel(CAR_COLORS[selectedColorIdx].threeHex);
    carGroupRef.current = carModel;
    scene.add(carModel);

    setIsLoaded(true);

    // 7. Interaction States (Mouse drag & parallax)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = 0.45;
    let targetCameraY = 2.0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging && carGroupRef.current) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.008;
        targetCameraY = Math.max(1.2, Math.min(3.5, targetCameraY - deltaY * 0.005));
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // 8. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (carGroupRef.current) {
        // Auto-rotation if enabled and not currently dragging
        if (isRotating && !isDragging) {
          targetRotationY += delta * 0.35;
        }

        // Smooth damping
        carGroupRef.current.rotation.y += (targetRotationY - carGroupRef.current.rotation.y) * 0.08;

        // Rotate wheels subtly during revolution
        wheelsRef.current.forEach((w) => {
          if (w.children[0]) {
            w.children[0].rotation.x += delta * 0.5;
          }
        });
      }

      // Smooth camera interpolation
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 0.6, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener("resize", handleResize);
      domElem.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      renderer.dispose();
      scene.clear();
    };
  }, [isSupported, createLuxuryCarModel, isRotating, selectedColorIdx]);

  // Update Car Body Paint Color
  const handleColorChange = (idx: number) => {
    setSelectedColorIdx(idx);
    const hex = CAR_COLORS[idx].threeHex;
    carBodyMeshRef.current.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshPhysicalMaterial) {
        mesh.material.color.setHex(hex);
      }
    });
  };

  // Toggle Headlights
  const toggleHeadlights = () => {
    const nextState = !isHeadlightsOn;
    setIsHeadlightsOn(nextState);
    headlightsLightsRef.current.forEach((light) => {
      light.intensity = nextState ? 4.0 : 0.0;
    });
    headlightsMeshRef.current.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.emissiveIntensity = nextState ? 3.5 : 0.2;
      }
    });
  };

  // Switch Lighting Atmosphere
  const handleLightingMode = (mode: "gold" | "studio" | "cyber") => {
    setLightingMode(mode);
    if (!sceneRef.current) return;

    if (mode === "gold") {
      sceneRef.current.background = new THREE.Color(0x0e0e11);
      if (sceneRef.current.fog) sceneRef.current.fog.color = new THREE.Color(0x0e0e11);
    } else if (mode === "studio") {
      sceneRef.current.background = new THREE.Color(0x1a1a20);
      if (sceneRef.current.fog) sceneRef.current.fog.color = new THREE.Color(0x1a1a20);
    } else if (mode === "cyber") {
      sceneRef.current.background = new THREE.Color(0x050a14);
      if (sceneRef.current.fog) sceneRef.current.fog.color = new THREE.Color(0x050a14);
    }
  };

  // Fallback 2.5D Studio View for Mobile or Reduced Motion
  if (isSupported === false) {
    return (
      <div className="relative w-full h-[420px] sm:h-[480px] bg-[#111111] rounded-[12px] overflow-hidden border border-[#303030] flex items-center justify-center group">
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent z-10 pointer-events-none" />
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className="px-2.5 py-1 bg-[#181818] border border-[#303030] text-[#C62828] text-[11px] font-semibold rounded-[6px] tracking-wide uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C62828]" />
            Studio Virtuel 2.5D
          </span>
        </div>

        <Image
          src="/vehicles/golf8.jpg"
          alt="TITAN CAR Studio Hero"
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          referrerPolicy="no-referrer"
        />

        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between bg-[#181818]/90 backdrop-blur-md p-3 rounded-[8px] border border-[#303030]">
          <div className="text-[13px] text-[#FFFFFF] font-medium">
            Volkswagen Golf 8 R-Line & Flotte Disponible
          </div>
          <div className="text-[12px] text-[#C62828] font-bold">
            Dès 4 800 DA / jour
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[450px] sm:h-[520px] lg:h-[560px] bg-[#111111] rounded-[12px] overflow-hidden border border-[#303030] shadow-none group select-none">
      
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Faites glisser pour faire pivoter le véhicule à 360°"
      />

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#111111] flex flex-col items-center justify-center gap-3 z-30">
          <div className="w-8 h-8 border-2 border-[#C62828] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-[#8A8A8A] font-medium tracking-wide">
            Initialisation du Studio 3D...
          </span>
        </div>
      )}

      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-2.5 py-1 bg-[#181818]/90 backdrop-blur-md border border-[#303030] text-[#FFFFFF] text-[11px] font-semibold rounded-[6px] tracking-wide uppercase flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-[#C62828]" />
            Studio 3D Temps Réel
          </span>
          <span className="hidden sm:inline-flex px-2 py-1 bg-[#181818]/80 backdrop-blur-md border border-[#303030] text-[#8A8A8A] text-[11px] rounded-[6px]">
            Glisser pour pivoter à 360°
          </span>
        </div>

        {/* Studio Lighting Switcher */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#181818]/90 backdrop-blur-md border border-[#303030] p-1 rounded-[8px]">
          <button
            type="button"
            onClick={() => handleLightingMode("gold")}
            className={`px-2 py-1 rounded-[6px] text-[11px] font-medium transition-colors cursor-pointer ${
              lightingMode === "gold" ? "bg-[#C62828] text-[#FFFFFF] font-bold" : "text-[#8A8A8A] hover:text-[#FFFFFF]"
            }`}
            title="Ambiance Rouge Titan"
          >
            Titan
          </button>
          <button
            type="button"
            onClick={() => handleLightingMode("studio")}
            className={`px-2 py-1 rounded-[6px] text-[11px] font-medium transition-colors cursor-pointer ${
              lightingMode === "studio" ? "bg-[#C62828] text-[#FFFFFF] font-bold" : "text-[#8A8A8A] hover:text-[#FFFFFF]"
            }`}
            title="Ambiance Studio Neutre"
          >
            Studio
          </button>
          <button
            type="button"
            onClick={() => handleLightingMode("cyber")}
            className={`px-2 py-1 rounded-[6px] text-[11px] font-medium transition-colors cursor-pointer ${
              lightingMode === "cyber" ? "bg-[#C62828] text-[#FFFFFF] font-bold" : "text-[#8A8A8A] hover:text-[#FFFFFF]"
            }`}
            title="Ambiance Graphite Nuit"
          >
            Nuit
          </button>
        </div>
      </div>

      {/* Bottom Interactive Paint Color & Feature Bar */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-[#181818]/90 backdrop-blur-md border border-[#303030] p-2.5 sm:p-3 rounded-[10px]">
        
        {/* Color Palette Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#8A8A8A] font-medium hidden sm:inline">Teinte :</span>
          <div className="flex items-center gap-1.5">
            {CAR_COLORS.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleColorChange(i)}
                className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                  selectedColorIdx === i ? "scale-125 border-[#FFFFFF] ring-2 ring-[#C62828]" : "border-[#303030] opacity-75 hover:opacity-100"
                }`}
                style={{ backgroundColor: c.hex }}
                title={`${c.name} (${c.desc})`}
              />
            ))}
          </div>
          <span className="text-[11px] text-[#E8E8E8] font-medium ml-1">
            {CAR_COLORS[selectedColorIdx].name}
          </span>
        </div>

        {/* Interactive Feature Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleHeadlights}
            className={`h-8 px-2.5 rounded-[6px] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isHeadlightsOn ? "bg-[#C62828] text-[#FFFFFF]" : "bg-[#222222] border border-[#303030] text-[#8A8A8A]"
            }`}
            title="Allumer / Éteindre les phares LED"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Phares {isHeadlightsOn ? "ON" : "OFF"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`h-8 px-2.5 rounded-[6px] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isRotating ? "bg-[#222222] border border-[#303030] text-[#C62828]" : "bg-[#222222] border border-[#303030] text-[#8A8A8A]"
            }`}
            title="Activer / Désactiver la rotation automatique"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin" : ""}`} />
            <span>Rotation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
