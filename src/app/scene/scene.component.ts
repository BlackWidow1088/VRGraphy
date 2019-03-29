import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as THREE from 'three';
import { globalValues } from '../contants';
import { RendererService } from '../services/renderer.service';
import { MatrixManager } from '../services/matrix.namespace';
import { Store } from '../services/store.model';
import { Line } from '../model/line.model';
import { GraphBox } from '../model/graph-box.model';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {
  constants = globalValues;
  graphSize = this.constants.boxSize - 2 * this.constants.margin;
  clipPlanes;

  moveX = 0;
  scale = 1;
  @ViewChild('sceneCanvas') sceneCanvas: ElementRef;
  graphBox: GraphBox[] = [];
  constructor(
    private rendererService: RendererService
  ) { }

  ngOnInit() {
    this.rendererService.listenToEvents().subscribe(data => {
      this.graphBox[0].listenToEvents(data);
    })
  }
  loadScene() {
    this.rendererService.loadScene(this.sceneCanvas).subscribe((data) => {
      const x = new Line({ color: 'red', linewidth: 5 }, { vertices: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0)] });
      const y = new Line({ color: 'green', linewidth: 5 }, { vertices: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0)] });
      const z = new Line({ color: 'blue', linewidth: 5 }, { vertices: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3)] });

      this.graphBox.push(new GraphBox({color: 'blue'}, {size: 1.00}, []));
      this.rendererService.addObject(this.graphBox[0].getObject3D());
      let colliders = this.graphBox[0].getTrackableObject3D();


      const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const mesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({ color: 'red' }));
      colliders = colliders.concat(mesh);
      this.rendererService.submitColliders(colliders);
      this.rendererService.addObject(mesh);
      this.rendererService.addObject(x.getObject3D());
      this.rendererService.addObject(y.getObject3D());
      this.rendererService.addObject(z.getObject3D());
    });
  }
  stopScene() {
    // this.graphBox[0].updateData([{ text: 'abhijeet4', color: 'yellow' }, { text: 'lllllllllllllldddddddddddd', color: 'red' }]);
    this.graphBox[0].modify(
      new THREE.Vector3(0.35, 0, 0),
      new THREE.Vector3(1,1,1)
    )
    //  this.rendererService.stopScene();
  }
}
