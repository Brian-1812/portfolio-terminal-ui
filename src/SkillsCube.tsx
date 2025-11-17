import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

// Vertex skills (8 corners) - large, bright green
const vertexSkills = [
  "JS/TS",
  "Python",
  "NodeJS",
  "Go",
  "AWS",
  "AI",
  "NoSQL",
  "SQL",
];

// Edge skills (12 edges) - smaller, grouped with dots
const edgeSkills = [
  "React · Next.js · Vue · Angular · Svelte",
  "Django · Nest.js · Express · FastAPI",
  "LangChain · LlamaIndex · CrewAI · OpenAI · RAG",
  "MongoDB · Redis · Firestore · Cassandra",
  "Nginx · Terraform · K8s · Docker · Ansible",
  "RabbitMQ · Bull · Kafka · SQS · NATS",
  "PostgreSQL · MySQL · DynamoDB · MongoDB",
  "TypeScript · Go · Solidity · C++ · Python",
  "CI/CD · GitHub Actions · Jenkins · CircleCI · GitLab",
  "Prometheus · Grafana · DataDog · LogStash · ELK",
  "React Native · Expo · Redux · MobX · Zustand",
  "Figma · WebGL · Three.js · Blender",
];

function SkillsCube() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.12;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.18;
    }
  });

  // Define cube vertices (corners)
  const vertices: [number, number, number][] = [
    [-2, -2, -2], // 0: back-bottom-left
    [2, -2, -2], // 1: back-bottom-right
    [2, 2, -2], // 2: back-top-right
    [-2, 2, -2], // 3: back-top-left
    [-2, -2, 2], // 4: front-bottom-left
    [2, -2, 2], // 5: front-bottom-right
    [2, 2, 2], // 6: front-top-right
    [-2, 2, 2], // 7: front-top-left
  ];

  // Define cube edges (12 edges connecting vertices)
  const edges: [number, number][] = [
    // Back face
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    // Front face
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    // Connecting edges
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  return (
    <group ref={groupRef}>
      {/* Render vertex skills - large, bright */}
      {vertices.map((vertex, i) => {
        const skill = vertexSkills[i];
        return (
          <Text
            key={`vertex-${i}`}
            position={vertex}
            fontSize={0.35}
            color="#0f0"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000"
          >
            {skill}
          </Text>
        );
      })}

      {/* Render edge skills - smaller, darker */}
      {edges.map((edge, i) => {
        const start = vertices[edge[0]];
        const end = vertices[edge[1]];

        // Calculate midpoint for edge position
        const mid: [number, number, number] = [
          (start[0] + end[0]) / 2,
          (start[1] + end[1]) / 2,
          (start[2] + end[2]) / 2,
        ];

        // Calculate direction vector
        const dx = Math.abs(end[0] - start[0]);
        const dy = Math.abs(end[1] - start[1]);
        const dz = Math.abs(end[2] - start[2]);

        // Determine rotation based on edge orientation
        let rotation: [number, number, number] = [0, 0, 0];

        if (dx > 0.1 && dy < 0.1 && dz < 0.1) {
          // Edge along X-axis (horizontal left-right)
          rotation = [0, 0, 0]; // Keep default orientation
        } else if (dy > 0.1 && dx < 0.1 && dz < 0.1) {
          // Edge along Y-axis (vertical up-down)
          rotation = [0, 0, Math.PI / 2]; // Rotate 90° around Z-axis
        } else if (dz > 0.1 && dx < 0.1 && dy < 0.1) {
          // Edge along Z-axis (depth front-back)
          rotation = [0, Math.PI / 2, 0]; // Rotate 90° around Y-axis
        }

        const skill = edgeSkills[i];

        return (
          <Text
            key={`edge-${i}`}
            position={mid}
            rotation={rotation}
            fontSize={0.12}
            color="#4a9c6d"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.015}
            outlineColor="#000"
            maxWidth={2.5}
            textAlign="center"
          >
            {skill}
          </Text>
        );
      })}
    </group>
  );
}

export default function SkillsCubeCanvas() {
  return (
    <div style={{ width: "450px", height: "450px", margin: "1rem 0" }}>
      <Canvas
        camera={{ position: [6, 6, 6], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={0.9} />
        <SkillsCube />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minDistance={4}
          maxDistance={15}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
