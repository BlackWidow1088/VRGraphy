import { Entity } from './entity.model';
import { Material } from './material.model';
import { Geometry } from './geometry.model';
import * as THREE from 'three';
import { Pallete } from './pallete.model';
import { Box } from './box.model';
import { MatrixManager } from '../services/matrix.namespace';
import { Store } from '../services/store.model';
import { DataBox } from './data-box.model';
import { Rectangular } from './rectangular.model';
import { PartitionBox } from './partition-box.model';
import { FieldBox } from './field-box.model';

export class GraphBox implements Entity {

  private graphBox: THREE.Group;
  private boxMargin = 0.1;
  private partitionMargin = 0.05;
  private partitionBox: PartitionBox;
  private palleteBox: Pallete;
  private planeHelpers: THREE.Object3D[] = [];

  private colliders: any[] = [];
  private size = 0;
  constructor(material: Material, geometry: Geometry, data: any[]) {
    this.size = geometry.size;
    this.graphBox = new THREE.Group();
    const box = new Box({
      color: material.color, wireframe: true, canClipChildren: true
    }, { size: geometry.size });
    this.graphBox.add(box.getObject3D());
    this.setPlaneHelper(box.clippingPlanes);
    this.setDataBox(box.clippingPlanes, data);
  }

  transform(matrix: any): void {
    this.graphBox.applyMatrix(matrix);
  }
  getObject3D() {
    return this.graphBox;
  }

  private setPlaneHelper(planes) {
    const usableSize = this.size - 2 * (this.boxMargin + this.partitionMargin);
    const values = [
      {
        color: 'red', euler: new THREE.Euler(0, Math.PI / 2.00, 0),
        position: new THREE.Vector3(-1 * usableSize / 2.00, 0, 0),
        name: 'planeHelperX'
      },
      {
        color: 'green', euler: new THREE.Euler(Math.PI / 2.00, 0, 0),
        position: new THREE.Vector3(0, -1 * usableSize / 2.00, 0),
        name: 'planeHelperY'
      },
      {
        color: 'blue', euler: new THREE.Euler(0, 0, 0),
        position: new THREE.Vector3(0, 0, -1 * usableSize / 2.00),
        name: 'planeHelperZ'
      },
    ];
    values.forEach(item => {
      const block = new Rectangular({ color: item.color, clippingPlanes: planes, opacity: 0.25, transparent: true, trackable: true },
        { width: usableSize, height: usableSize, depth: 0.01, name: item.name });
      block.transform(MatrixManager.getTransformationMatrix(
        item.position,
        item.euler,
        new THREE.Vector3(1, 1, 1)
      ));
      this.colliders = this.colliders.concat(block.getTrackableObject3D());
      this.graphBox.add(block.getObject3D());
    });
  }

  private setDataBox(planes, data) {
    const dataBox = new DataBox({ clippingPlanes: planes }, {
      size: this.size - 2 * (this.boxMargin + this.partitionMargin)
    }, data);
    this.setPallete(dataBox.getPalleteData());
    this.setPartitionBoxes(dataBox.getPartitionData());
    this.setFieldBoxes(dataBox.getFieldBoxData());
    this.graphBox.add(dataBox.getObject3D());
  }

  private setPallete(data): THREE.Object3D {
    this.palleteBox = new Pallete({
      color: 'blue'
    }, {
        font: Store.getInstance().Fonts[0],
        height: 0.2
      });
    this.palleteBox.setData([{ text: 'abhijeet', color: 'red' }, { text: 'llllllllllllll', color: 'red' }]);
    this.palleteBox.transform(MatrixManager.getTransformationMatrix(
      new THREE.Vector3(this.size / 2.00, this.size / 2.00, this.size / 2.00),
      new THREE.Euler(0, 0, 0, 'XYZ'),
      new THREE.Vector3(1, 1, 1)
    ));
    this.colliders = this.colliders.concat(this.palleteBox.getTrackableObject3D());
    this.graphBox.add(this.palleteBox.getObject3D());
  }

  private setPartitionBoxes(data) {
    const size = this.size - 2 * this.boxMargin;
    this.partitionBox = new PartitionBox({
      color: 'red'
    }, {
        margin: this.partitionMargin,
        width: size,
        height: this.boxMargin * 0.5,
      }, data[0]);
    this.partitionBox.transform(MatrixManager.getTransformationMatrix(
      new THREE.Vector3(-0.5 * this.size + this.boxMargin, 0.5 * this.size - this.boxMargin, this.size * 0.5),
      new THREE.Euler(0, 0, 0, 'XYZ'),
      new THREE.Vector3(1, 1, 1)
    ));
    this.graphBox.add(this.partitionBox.getObject3D());
  }

  private setFieldBoxes(data) {
    const size = this.size - 2 * this.boxMargin;
    let fieldBox = new FieldBox({
      color: 'red'
    }, {
        text: data[0],
        width: size,
        height: this.boxMargin * 0.5,
      });
    fieldBox.transform(MatrixManager.getTransformationMatrix(
      new THREE.Vector3(-0.5 * this.size + this.boxMargin, 0.5 * this.size - (this.boxMargin * 0.5), this.size * 0.5),
      new THREE.Euler(0, 0, 0, 'XYZ'),
      new THREE.Vector3(1, 1, 1)
    ));
    this.graphBox.add(fieldBox.getObject3D());
    this.colliders = this.colliders.concat(fieldBox.getTrackableObject3D());
  }

  modify(position: THREE.Vector3, scale: THREE.Vector3) {
    this.partitionBox.updatePartition(position.x, scale.x);
  }

  listenToEvents(data) {
    console.log(data);
  }

  getTrackableObject3D(): any[] {
    return this.colliders;
  }
}
