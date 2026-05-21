"use client";

import { NeuralScene } from "@components/NeuralScene";
import { PhilosopherScene } from "@components/scenes/PhilosopherScene";
import { SociologyScene } from "./SociologyScene";
import { HistoryScene } from "./HistoryScene";
import { PoliticsScene } from "./PoliticsScene";
import { TechScene } from "./TechScene";

const SCENE_MAP: Record<string, React.ComponentType<{ className?: string; color?: string }>> = {
  ai: NeuralScene,
  philosophy: PhilosopherScene,
  tech: TechScene,
  sociology: SociologyScene,
  politics: PoliticsScene,
  history: HistoryScene,
};

export function CategoryScene({ category, className }: { category: string; className?: string }) {
  const Scene = SCENE_MAP[category];
  if (!Scene) return null;
  return <Scene className={className} color="#CF5C36" />;
}
