import * as THREE from 'three';

export interface Geometry {
  name?: string;

  size?: number;
  transformation?: THREE.Matrix4; // column-major format
  vertices?: THREE.Vector3[];

  isTopLeftCorner?: boolean; // the drawing of entity will be shifted to (entity.width/2, -entity.height/2, -entity.depth/2)

  isVertical?: boolean;

  height?: number;
  width?: number;
  depth?: number;
  curveSegments?: number;
  font?: any;
  text?: string;
  isCenterText?: boolean;

  margin?: number;
  orientation?: THREE.Vector3;
  distanceFromOrigin?: number;

}

