import { Material } from './material.model';
import * as THREE from 'three';
import { Geometry } from './geometry.model';
import { Entity } from './entity.model';

 // NOTE: Matrix4 should be column-major format.
export class Box implements Entity {
  private box: THREE.Mesh;
  clippingPlanes = [];

  constructor(material: Material, geometry: Geometry) {
    const boxGeometry = new THREE.BoxGeometry(geometry.size, geometry.size, geometry.size);
    this.box = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial(material));
    if (geometry.transformation) {
    this.box.applyMatrix(geometry.transformation);
    }
    if (material.canClipChildren) {
      this.calculateClippingPlanes(geometry.size / 2.00);
    }
  }

  calculateClippingPlanes(distance) {
    this.box.updateMatrix();
    this.box.updateMatrixWorld();
    const planes = [
      new THREE.Plane(new THREE.Vector3(0, 1, 0), distance),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), distance),
      new THREE.Plane(new THREE.Vector3(1, 0, 0), distance),
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), distance),
      new THREE.Plane(new THREE.Vector3(0, 0, 1), distance),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), distance)
    ];
    planes.forEach(item => {
      item.applyMatrix4(this.box.matrix);
    });
    this.clippingPlanes = planes;
  }

  transform(matrix: THREE.Matrix4) {
    this.box.applyMatrix(matrix);
    this.clippingPlanes.forEach(item => {
      item.applyMatrix4(this.box.matrix);
    });
  }
  getObject3D() {
    return this.box;
  }

  getTrackableObject3D(): any[] {
    return [];
  }

}
