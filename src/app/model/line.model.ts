import * as THREE from 'three';
import { Entity } from './entity.model';
import { Geometry } from './geometry.model';
import { Material } from './material.model';

export class Line implements Entity {
  private line: THREE.Line;
  constructor(material: Material, geometry: Geometry) {
    let lineGeometry = new THREE.Geometry();
    lineGeometry.vertices = geometry.vertices;
    this.line = new THREE.Line(lineGeometry,  new THREE.LineBasicMaterial(material));
    // createLine({
    //   position: { x: this.initial['x'].origin, y: this.initial['y'].origin, z: this.initial['z'].origin },
    //   material: { color: this.boxSettings.axes[item].color, linewidth: 5, clippingPlanes: this.boxSettings.clippingPlanes, clipShadows: true, clipIntersection: false },
    //   vertices: [new THREE.Vector3(-1 * xValue, -1 * yValue, -1 * zValue), new THREE.Vector3(xValue, yValue, zValue)]
    // })
  }
  transform(matrix: any): void {
    this.line.applyMatrix(matrix);
  }
  getObject3D() {
    return this.line;
  }

}
