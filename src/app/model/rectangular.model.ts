import { Material } from './material.model';
import { Geometry } from './geometry.model';
import * as THREE from 'three';
import { Entity } from './entity.model';
import { MatrixManager } from 'src/app/services/matrix.namespace';

export class Rectangular implements Entity {
  private rectangular: THREE.Group;
  private colliders: any[] = [];
  constructor(material: Material, geometry: Geometry) {
    this.rectangular = new THREE.Group();
    const boxGeometry = new THREE.BoxGeometry(geometry.width, geometry.height, geometry.depth);
    const mesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial(material));
    mesh.trackable = material.trackable;
    mesh.name = geometry.name;
    this.rectangular.add(mesh);
    this.colliders.push(mesh);
    if (geometry.isTopLeftCorner) {
      this.transform(MatrixManager.getTransformationMatrix(
        new THREE.Vector3(geometry.width / 2.00, -1 * geometry.height / 2.00, -1 * geometry.depth / 2.00),
        new THREE.Euler(0, 0, 0, 'XYZ'),
        new THREE.Vector3(1, 1, 1)
      ));
    }
  }
  transform(matrix: any): void {
    this.rectangular.applyMatrix(matrix);
  }
  getObject3D() {
    return this.rectangular;
  }
  getTrackableObject3D() {
    return this.colliders;
  }
}
