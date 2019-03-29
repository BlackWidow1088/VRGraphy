import { Geometry } from './geometry.model';
import { Material } from './material.model';
import * as THREE from 'three';
import { Entity } from './entity.model';
import { Data } from './data.model';
import { TextBox } from './text-box.model';
import { MatrixManager } from '../services/matrix.namespace';
import { Box } from './box.model';
import { Rectangular } from './rectangular.model';
import { Line } from './line.model';

export class Pallete implements Entity {
  private textSize = 0.05;
  private textHeight = 0;
  private textCurveSegments = 4;
  private colorBoxSize = 0.05;

  private spaceBetweenTextAndBox = 0.01;
  private spaceBetweenRows = 0.1;
  private spaceBetweenColumns = 0.5;
  private spaceBetweenTextAndColor = 0.05;

  private pallete: THREE.Group;
  private geometry: Geometry;
  private material: Material;

  private colliders = [];
  constructor(material: Material, geometry: Geometry) {
    this.pallete = new THREE.Group();
    this.pallete.name = 'pallete';
    this.geometry = geometry;
    this.material = material;
  }

  setData(data: Data[]) {
    this.pallete.children = [];
    const rows = Math.floor(this.geometry.height * 1.0 / (this.spaceBetweenRows + this.textSize));
    if (!rows) {
      return;
    }
    const columns = Math.ceil(data.length / rows);

    const widthBlock = columns * (this.spaceBetweenColumns);
    let block = new Rectangular({ color: this.material.color, trackable: true },
       { width: widthBlock, height: this.geometry.height, depth: 0.01, isTopLeftCorner: true });
    this.colliders = this.colliders.concat(block.getTrackableObject3D());
    this.pallete.add(block.getObject3D());
    let textgroup = new THREE.Group();
    this.pallete.add(textgroup);

    let currentIndex = 0;
    for (let j = 0; j < columns; j++) {
      const columnGroup = new THREE.Group();
      const columnOffset = this.spaceBetweenColumns * j;

      let currentRow = -1 * this.textSize / 2.00;
      for (let i = 0; i < rows; i++) {
        const rowGroup = new THREE.Group();
        const item = data[currentIndex];

        const box = new Box({
          color: item.color
        }, { size: this.colorBoxSize });
        box.transform(MatrixManager.getTransformationMatrix(
          new THREE.Vector3(this.colorBoxSize / 2.0, currentRow, 0),
          new THREE.Euler(0, 0, 0, 'XYZ'),
          new THREE.Vector3(1, 1, 1)
        ));

        const text = new TextBox({ color: item.color }, {
          text: item.text,
          font: this.geometry.font,
          size: this.textSize,
          height: this.textHeight,
          curveSegments: this.textCurveSegments,
        });
        text.transform(MatrixManager.getTransformationMatrix(
          new THREE.Vector3(this.colorBoxSize + this.spaceBetweenTextAndBox, currentRow - (this.textSize / 2.0), 0),
          new THREE.Euler(0, 0, 0, 'XYZ'),
          new THREE.Vector3(1, 1, 1)
        ));
        rowGroup.add(text.getObject3D());
        rowGroup.add(box.getObject3D());
        columnGroup.add(rowGroup);
        currentIndex++;
        if (!data[currentIndex]) {
          break;
        }
        currentRow -= (this.spaceBetweenRows + this.textSize);
      }
      columnGroup.applyMatrix(MatrixManager.getTransformationMatrix(
        new THREE.Vector3(columnOffset, 0, 0),
        new THREE.Euler(0, 0, 0),
        new THREE.Vector3(1, 1, 1)
      ));
      textgroup.add(columnGroup);
    }
  }

  transform(matrix: any) {
    this.pallete.applyMatrix(matrix);
  }
  getObject3D() {
    return this.pallete;
  }
  getTrackableObject3D() {
    return this.colliders;
  }

}
