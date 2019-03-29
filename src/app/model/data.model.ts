import * as THREE from 'three';
export interface Data {
  text?: string;
  color?: THREE.Color;
}

export interface PartitionData {
  min: number;
  max: number;
}
