import { Material } from './material.model';
import { Geometry } from './geometry.model';
import * as THREE from 'three';
import { Entity } from './entity.model';
import { MatrixManager } from 'src/app/services/matrix.namespace';
import { Rectangular } from './rectangular.model';
import { TextBox } from './text-box.model';
import { Store } from '../services/store.model';

export class FieldBox implements Entity {
  private fieldBox: THREE.Group;
  private textSize = 0.03;
  private textHeight = 0;
  private textCurveSegments = 4;
  private colliders: any[] = [];
  constructor(material: Material, geometry: Geometry) {
    this.fieldBox = new THREE.Group();
    const block = new Rectangular({ color: material.color }, {
      width: geometry.width, height: geometry.height, depth: 0.01
    });
    block.transform(MatrixManager.getTransformationMatrix(
      new THREE.Vector3(geometry.width / 2.00, geometry.height / 2.00, -0.01 / 2.0),
      new THREE.Euler(0, 0, 0, 'XYZ'),
      new THREE.Vector3(1, 1, 1)
    ));
    this.fieldBox.add(block.getObject3D());
    this.drawText(material, geometry);
    this.drawProgressArrows(material, geometry);
  }
  transform(matrix: any): void {
    this.fieldBox.applyMatrix(matrix);
  }
  getObject3D() {
    return this.fieldBox;
  }

  getTrackableObject3D(): any[] {
    return this.colliders;
  }
  drawText(material, geometry) {
    const textBox = new TextBox(material, {
      text: geometry.text,
      font: Store.getInstance().Fonts[0],
      size: this.textSize,
      height: this.textHeight,
      curveSegments: this.textCurveSegments,
      isCenterText: true
    });
    textBox.transform(MatrixManager.getTransformationMatrix(
      new THREE.Vector3(geometry.width / 2.00, geometry.height / 2.00, 0.02),
      new THREE.Euler(0, 0, 0, 'XYZ'),
      new THREE.Vector3(1, 1, 1)
    ));
    this.fieldBox.add(textBox.getObject3D());
  }

  drawProgressArrows(material, geometry) {
    const arrow = [
      { name: 'increaseX', dir: new THREE.Vector3(1, 0, 0), origin: new THREE.Vector3(geometry.width, 0.025, 0.01), width: geometry.width },
      { name: 'decreaseX', dir: new THREE.Vector3(-1, 0, 0), origin: new THREE.Vector3(0, 0.025, 0.01), width: geometry.width },
    ]
    arrow.forEach(item => {
      const shape = new THREE.Shape();
      shape.moveTo(item.width - 0.025, -0.025);
      shape.lineTo(item.width - 0.025, 0.025);
      shape.lineTo(item.width, 0);
      shape.lineTo(item.width - 0.025, -0.025);

      let extrudeSettings = {
        steps: 2,
        depth: 0.01,
      };

      var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      var mesh = new THREE.Mesh(geometry, material);
      // scene.add(mesh);

      // const dir = item.dir.normalize();
      // const hex = 0xffff00;
      // const arrowHelper = new THREE.ArrowHelper(item.dir, item.origin, 0, hex, 0.05, 0.05);
      // arrowHelper.name = item.name;
      this.colliders.push(mesh);
      this.fieldBox.add(mesh);
    });
  }
}
