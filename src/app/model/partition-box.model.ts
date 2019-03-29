import { Material } from './material.model';
import { Geometry } from './geometry.model';
import * as THREE from 'three';
import { Entity } from './entity.model';
import { Rectangular } from './rectangular.model';
import { PartitionData } from './data.model';
import { Line } from './line.model';
import { TextBox } from './text-box.model';
import { MatrixManager } from '../services/matrix.namespace';
import { Store } from '../services/store.model';

export class PartitionBox implements Entity {
  private partitionBox: THREE.Group;

  private partitions = 5;
  private textSize = 0.03;
  private textHeight = 0;
  private textCurveSegments = 4;

  private geometry: Geometry;
  private material: Material;
  private data: PartitionData;
  private scale = 1;
  private partLength = 0;
  private partValueLength = 0;
  private colliders = [];
  constructor(material: Material, geometry: Geometry, data: PartitionData) {
    this.material = material;
    this.geometry = geometry;
    this.data = data;
    this.partitionBox = new THREE.Group();
    if (geometry.isVertical) {
      this.partLength = (this.geometry.height - (2 * this.geometry.margin)) / (this.partitions - 1);
    } else {
      this.partLength = (this.geometry.width - (2 * this.geometry.margin)) / (this.partitions - 1);
    }
    this.partValueLength = (this.data.max - this.data.min) / (this.partitions - 1);
    this.create();
  }
  transform(matrix: any): void {
    this.partitionBox.applyMatrix(matrix);
  }
  getObject3D() {
    return this.partitionBox;
  }
  getTrackableObject3D(): any[] {
    return this.colliders;
  }

  create() {
    const block = new Rectangular({ color: this.material.color }, {
      width: this.geometry.width, height: this.geometry.height, depth: 0.01
    });
    block.transform(MatrixManager.getTransformationMatrix(
      new THREE.Vector3(this.geometry.width / 2.00, this.geometry.height / 2.00, -0.01 / 2.0),
      new THREE.Euler(0, 0, 0, 'XYZ'),
      new THREE.Vector3(1, 1, 1)
    ));
    this.drawPartitionStripes();
    this.drawPartitionText(this.data.min, this.data.max);
    this.partitionBox.add(block.getObject3D());
  }


  drawPartitionText(min, max) {
    const material = { color: 'black' };
    const geometry = {
      name: '',
      font: Store.getInstance().Fonts[0],
      size: this.textSize,
      height: this.textHeight,
      curveSegments: this.textCurveSegments,
      isCenterText: true,
      text: ''
    };
    let current = this.geometry.margin;
    for (let i = 0; i < this.partitions; i++) {
      this.partitionBox.remove(this.partitionBox.getObjectByName(`partition${i}`));
      geometry.name = `partition${i}`;
      geometry.text = `${(min + (i * (max - min) / 4.00)).toFixed(2)}`;
      const text = new TextBox(material, geometry);
      text.transform(MatrixManager.getTransformationMatrix(
        new THREE.Vector3(this.geometry.isVertical ? 0 : current, this.geometry.isVertical ? current : 0, 0.02),
        new THREE.Euler(0, 0, 0, 'XYZ'),
        new THREE.Vector3(1, 1, 1)
      ));
      this.partitionBox.add(text.getObject3D());
      current += 1.00 * this.partLength;
    }
  }

  drawPartitionStripes() {
    if (this.geometry.isVertical) {
      let currentY = this.geometry.margin;
      for (let i = 0; i < this.partitions; i++) {
        this.partitionBox.add(new Line({ color: 'black', linewidth: 5 }, {
          vertices: [new THREE.Vector3(0, currentY, 0.01), new THREE.Vector3(this.geometry.width, currentY, 0.02)]
        }).getObject3D());
        currentY += 1.00 * this.partLength;
      }
    } else {
      let currentX = this.geometry.margin;
      for (let i = 0; i < this.partitions; i++) {
        this.partitionBox.add(new Line({ color: 'black', linewidth: 5 }, {
          vertices: [new THREE.Vector3(currentX, 0, 0.01), new THREE.Vector3(currentX, this.geometry.height, 0.02)]
        }).getObject3D());
        currentX += 1.00 * this.partLength;
      }
    }
  }

  updatePartition(position: number, scale: number) {
    // this.data = {min: 100.0, max: 200};
    const min = this.data.min - (position * this.partValueLength * scale / this.partLength);
    const max = min +  ((this.partitions - 1) * this.partValueLength /  scale );
    this.drawPartitionText(min, max);
  }

  getValue(position: number) {
    return this.data.min + (position * (this.partValueLength) / this.partLength);
  }
}
