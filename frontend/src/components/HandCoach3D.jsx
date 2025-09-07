import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { POSES, DEFAULT_POSE } from "../poses";

function normalizeScene(scene, targetSize = 1.8) {
  scene.position.set(0, 0, 0);
  scene.rotation.set(0, 0, 0);
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3(), center = new THREE.Vector3();
  box.getSize(size); box.getCenter(center);
  scene.position.sub(center);
  const s = (targetSize / Math.max(size.x, size.y, size.z || 1));
  scene.scale.setScalar(s);
  scene.updateMatrixWorld(true);
}

function buildBoneMapPT(scene) {
  const find = (includes) => {
    let hit = null;
    scene.traverse(o => {
      if (!o.isBone) return;
      const n = (o.name || "").toLowerCase();
      if (includes.every(s => n.includes(s))) hit = o;
    });
    return hit;
  };
  // map to our canonical names
  const mapFinger = (tag) => ({
    mcp: find([`mtcarp_${tag}`]),
    pip: find([`flng01_${tag}`]),
    dip: find([`flng02_${tag}`]),
    tip: find([`flng03_${tag}`]), // rarely needed
  });

  return {
    thumb:  mapFinger("dedao"),
    index:  mapFinger("ind"),
    middle: mapFinger("meio"),
    ring:   mapFinger("anelar"),
    pinky:  mapFinger("mind"),
  };
}

function applyPoseToBones(bones, pose) {
  const fingers = Object.keys(pose);
  fingers.forEach(f => {
    const segs = bones[f] || {};
    const cfg  = pose[f]  || {};
    if (segs.mcp) segs.mcp.rotation.x = cfg.mcp ?? 0;
    if (segs.pip) segs.pip.rotation.x = cfg.pip ?? 0;
    if (segs.dip) segs.dip.rotation.x = cfg.dip ?? 0;
  });
}

function forceSkeletonUpdate(scene) {
  scene.traverse(o => {
    if (o.isSkinnedMesh && o.skeleton) {
      o.skeleton.pose(); // ensure constraints apply
    }
    o.updateMatrixWorld(true);
  });
}

function HandRig({ poseLabel }) {
  const { scene } = useGLTF("/hand.glb?v=3");
  const root = useRef();

  // Normalize once
  useMemo(() => { normalizeScene(scene, 1.6); }, [scene]);

  // Index bones once for this Portuguese rig
  const bones = useMemo(() => buildBoneMapPT(scene), [scene]);

  // Apply pose whenever label changes
  useEffect(() => {
    const pose = POSES[poseLabel] || POSES[DEFAULT_POSE];
    applyPoseToBones(bones, pose);
    forceSkeletonUpdate(scene);
  }, [poseLabel, bones, scene]);

  return (
    <group ref={root} rotation={[0, Math.PI, 0]}scale={[0.2,0.2,0.2]} >
      <primitive object={scene} />
    </group>
  );
}

export default function HandCoach3D({ pose }) {
  return (
    <div style={{ width: "100%", height: 320, borderRadius: 12, overflow: "hidden" }}>
      <Canvas camera={{ position: [0, 1.2, 75], fov: 45 }}>
        <color attach="background" args={["#0b1220"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        <Suspense fallback={null}>
          <HandRig poseLabel={pose || DEFAULT_POSE} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={2} maxDistance={100} target={[0,0,0]} />
      </Canvas>
    </div>
  );
}
