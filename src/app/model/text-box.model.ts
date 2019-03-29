import { Geometry } from './geometry.model';
import { Material } from './material.model';
import * as THREE from 'three';
import { Entity } from './entity.model';
export class TextBox implements Entity {
  private textBox: THREE.Group;
  constructor(material: Material, geometry: Geometry) {
    this.textBox = new THREE.Group();
    if (geometry.name) {
      this.textBox.name = geometry.name;
    }
    let textGeo = new THREE.TextGeometry(geometry.text, geometry);
    // useful for computing centred text and add for the axxes required
    textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
    let materials = [
      new THREE.MeshPhongMaterial({ color: material.color, flatShading: true }), // front
      new THREE.MeshPhongMaterial({ color: material.color }) // side
    ];
    let textMesh = new THREE.Mesh(textGeo, materials);
    if (geometry.isCenterText) {
      textGeo.computeBoundingBox();
      textGeo.computeVertexNormals();
      const centerOffset =  -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
      // Matrix4.set() uses row-major format so need to change the orientation
      const mat = new THREE.Matrix4().set(
        1, 0, 0, centerOffset,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );
      textMesh.applyMatrix(mat);
    }
    this.textBox.add(textMesh);
  }
  transform(matrix: any) {
    this.textBox.applyMatrix(matrix);
  }
  getObject3D() {
    return this.textBox;
  }
}
