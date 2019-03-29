import { Entity } from './entity.model';
import { Material } from './material.model';
import { Geometry } from './geometry.model';
import * as THREE from 'three';
import { Data, PartitionData } from './data.model';
import { PlaneHelper } from './plane-helper.model';

export class DataBox implements Entity {

  private dataBox: THREE.Group;
  private data: Data;
  private partitionData: PartitionData[] = [];
  constructor(material: Material, geometry: Geometry, data: Data) {
    this.dataBox = new THREE.Group();
    // var mat = new THREE.MeshBasicMaterial({color: "red", wireframe: true, transparent: true, opacity: 0.25})
    this.data = data;
  }
  transform(matrix: any): void {
    this.dataBox.applyMatrix(matrix);
  }
  getObject3D() {
    return this.dataBox;
  }

  getPalleteData() {
    return this.data;
  }

  getPartitionData() {
    return [{min: 0.0, max: 100.0}];
  }

  getFieldBoxData() {
    return ['product'];
  }
}
