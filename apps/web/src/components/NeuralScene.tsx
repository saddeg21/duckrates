"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SW = 1200;
const SH = 280;
const C = "#CF5C36";
const NODE_R = 12;

const LAYER_X = [140, 360, 560, 760, 1060];
const LAYER_COUNTS = [4, 5, 6, 5, 3];

type Node = { x: number; y: number; layer: number; index: number };

function buildNodes(): Node[] {
  const nodes: Node[] = [];
  for (let l = 0; l < LAYER_X.length; l++) {
    const count = LAYER_COUNTS[l];
    const gap = 42;
    const totalH = (count - 1) * gap;
    const startY = SH / 2 - totalH / 2;
    for (let i = 0; i < count; i++) {
      nodes.push({ x: LAYER_X[l], y: startY + i * gap, layer: l, index: i });
    }
  }
  return nodes;
}

const NODES = buildNodes();

type Edge = { from: Node; to: Node; key: string };

function buildEdges(): Edge[] {
  const edges: Edge[] = [];
  for (let l = 0; l < LAYER_X.length - 1; l++) {
    const fromNodes = NODES.filter((n) => n.layer === l);
    const toNodes = NODES.filter((n) => n.layer === l + 1);
    for (const from of fromNodes) {
      for (const to of toNodes) {
        edges.push({ from, to, key: `${from.layer}-${from.index}-${to.layer}-${to.index}` });
      }
    }
  }
  return edges;
}

const EDGES = buildEdges();

function SignalPulse({ edge, delay }: { edge: Edge; delay: number }) {
  return (
    <motion.circle
      r={3.5}
      fill={C}
      initial={{ cx: edge.from.x, cy: edge.from.y, opacity: 0 }}
      animate={{
        cx: [edge.from.x, edge.to.x],
        cy: [edge.from.y, edge.to.y],
        opacity: [0, 0.9, 0.9, 0],
      }}
      transition={{
        duration: 0.8,
        delay,
        repeat: Infinity,
        repeatDelay: 3 + delay * 0.1,
        ease: "easeInOut",
      }}
    />
  );
}

function Neuron({ node }: { node: Node }) {
  return (
    <circle cx={node.x} cy={node.y} r={NODE_R} fill={C} opacity={0.8} />
  );
}

function NodeGlow({ node, delay }: { node: Node; delay: number }) {
  return (
    <motion.circle
      cx={node.x}
      cy={node.y}
      r={NODE_R}
      fill={C}
      opacity={0}
      animate={{ opacity: [0, 0.4, 0], scale: [1, 1.6, 1] }}
      transition={{
        duration: 1.4,
        delay,
        repeat: Infinity,
        repeatDelay: 4 + delay * 0.3,
        ease: "easeOut",
      }}
      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
    />
  );
}

export function NeuralScene({
  className,
  color,
}: {
  className?: string;
  color?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const c = color ?? C;

  const activeEdges = EDGES.filter((_, i) => i % 3 === 0);

  if (!mounted) {
    return (
      <div
        className={`w-full overflow-hidden select-none${className ? ` ${className}` : ""}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`w-full max-w-[var(--width-content)] mx-auto overflow-hidden select-none${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${SW} ${SH}`}
        width="100%"
        style={{ display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {EDGES.map((e) => (
          <line
            key={e.key}
            x1={e.from.x} y1={e.from.y}
            x2={e.to.x} y2={e.to.y}
            stroke={c}
            strokeWidth={1.8}
            opacity={0.25}
          />
        ))}

        {NODES.map((node, i) => (
          <NodeGlow key={`glow-${i}`} node={node} delay={i * 0.5} />
        ))}

        {activeEdges.map((e, i) => (
          <SignalPulse
            key={`pulse-${e.key}`}
            edge={e}
            delay={i * 0.4}
          />
        ))}

        {NODES.map((node, i) => (
          <Neuron key={`n-${i}`} node={node} />
        ))}
      </svg>
    </div>
  );
}
