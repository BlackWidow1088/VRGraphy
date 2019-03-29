import * as THREE from 'three';

export interface Entity {
  transform(matrix: THREE.Matrix4): void;
  getObject3D(): THREE.Object3D;
  getTrackableObject3D(): THREE.Mesh[];
}
