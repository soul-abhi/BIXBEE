import { useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  Clock,
  Color,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  TetrahedronGeometry,
  WebGLRenderer,
} from 'three';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 4000 : 12000;

    const geometry = new TetrahedronGeometry(0.22);
    const material = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.42, blending: AdditiveBlending });
    const instancedMesh = new InstancedMesh(geometry, material, count);
    const dummy = new Object3D();
    const color = new Color();
    scene.add(instancedMesh);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let globalShatter = 15;
    let targetShatter = 15;
    let shatterTimeout = null;
    let frameId = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = mouseX * 0.26;
      targetRotationX = -mouseY * 0.26;
    };

    const onClick = () => {
      targetShatter = 40;
      if (shatterTimeout) clearTimeout(shatterTimeout);
      shatterTimeout = setTimeout(() => { targetShatter = 15; }, 1500);
    };

    window.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    const baseData = new Float32Array(count * 8);
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const cbrt = Math.floor(Math.pow(count, 0.333333));
    const step = 2 / 40;

    for (let i = 0; i < count; i++) {
      const ix = i % cbrt;
      const iy = Math.floor(i / cbrt) % cbrt;
      const iz = Math.floor(i / (cbrt * cbrt));

      const nx = (ix / cbrt) * 2 - 1;
      const ny = (iy / cbrt) * 2 - 1;
      const nz = (iz / cbrt) * 2 - 1;

      const mx = Math.floor(nx / step) * step;
      const my = Math.floor(ny / step) * step;
      const mz = Math.floor(nz / step) * step;

      const b = i * 8;
      baseData[b] = mx;
      baseData[b + 1] = my;
      baseData[b + 2] = mz;
      baseData[b + 3] = (nx - mx) / step;
      baseData[b + 4] = (ny - my) / step;
      baseData[b + 5] = (nz - mz) / step;
      baseData[b + 6] = ix;
      baseData[b + 7] = iy;

      const p = i * 3;
      positions[p] = mx * 50;
      positions[p + 1] = my * 50;
      positions[p + 2] = mz * 50;
      targets[p] = positions[p];
      targets[p + 1] = positions[p + 1];
      targets[p + 2] = positions[p + 2];
    }

    const clock = new Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      globalShatter += (targetShatter - globalShatter) * 0.05;
      const scale = 50;

      for (let i = 0; i < count; i++) {
        const b = i * 8;
        const mx = baseData[b];
        const my = baseData[b + 1];
        const mz = baseData[b + 2];
        const lx = baseData[b + 3];
        const ly = baseData[b + 4];
        const lz = baseData[b + 5];
        const ix = baseData[b + 6];
        const iy = baseData[b + 7];

        const phase = Math.sin(mx * 3 + my * 4 + mz * 5 - t * 2);
        const evolve = Math.max(0, phase);

        const mLen = Math.sqrt(mx * mx + my * my + mz * mz);
        const sx = mLen === 0 ? 0 : (mx / mLen) * scale;
        const sy = mLen === 0 ? 0 : (my / mLen) * scale;
        const sz = mLen === 0 ? 0 : (mz / mLen) * scale;

        const formMorph = (Math.sin(t * 0.5) + 1) * 0.5;

        let px = mx * scale * (1 - formMorph) + sx * formMorph;
        let py = my * scale * (1 - formMorph) + sy * formMorph;
        const pz = mz * scale * (1 - formMorph) + sz * formMorph + lz * evolve * globalShatter;

        px += lx * evolve * globalShatter;
        py += ly * evolve * globalShatter;

        const angle = pz * 0.05 * Math.sin(t * 0.3);
        const finalX = px * Math.cos(angle) - py * Math.sin(angle);
        const finalY = px * Math.sin(angle) + py * Math.cos(angle);

        const edgeDist = Math.min(1, Math.max(0, (mLen - 0.5) * 2));
        const hue = Math.abs((mx * 0.5 + my * 0.3 + mz * 0.2 + t * 0.1) % 1);
        const lightness = 0.5 + 0.5 * evolve - edgeDist * 0.3;
        color.setHSL(hue, 0.9, lightness);

        const p = i * 3;
        targets[p] = finalX;
        targets[p + 1] = finalY;
        targets[p + 2] = pz;

        positions[p] += (targets[p] - positions[p]) * 0.08;
        positions[p + 1] += (targets[p + 1] - positions[p + 1]) * 0.08;
        positions[p + 2] += (targets[p + 2] - positions[p + 2]) * 0.08;

        dummy.position.set(positions[p], positions[p + 1], positions[p + 2]);
        dummy.rotation.x = t + ix;
        dummy.rotation.y = t + iy;
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);
        instancedMesh.setColorAt(i, color);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

      instancedMesh.rotation.x += (targetRotationX - instancedMesh.rotation.x) * 0.1;
      instancedMesh.rotation.y += (targetRotationY - instancedMesh.rotation.y) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      if (frameId) cancelAnimationFrame(frameId);
      if (shatterTimeout) clearTimeout(shatterTimeout);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-25 z-0 bg-transparent mix-blend-normal"
    />
  );
};

export default ParticleCanvas;
