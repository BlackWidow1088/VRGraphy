import { Injectable, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { Observable, of, Subject } from 'rxjs';
import { Store } from 'src/app/services/store.model';

@Injectable({
  providedIn: 'root'
})
export class RendererService {
  private sceneCanvasElement: ElementRef;
  private scene;
  private group;
  private camera;
  private cameraTarget;
  private renderer;
  private targetRotation = 0;
  private targetRotationOnMouseDown = 0;

  private mouseX = 0;
  private mouseXOnMouseDown = 0;
  mouseDown = false;

  private stopSceneAnimation: boolean;
  private eventListeners = {};
  private rayCaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private listenEvents = new Subject();
  private colliders: THREE.Mesh[] = [];

  // for reference to know where clikced on screen
  plane = new THREE.Plane();
  planeNormal = new THREE.Vector3();
  point = new THREE.Vector3();
  INTERSECTED: any;
  constructor() { }

  listenToEvents() {
    return this.listenEvents.asObservable();
  }

  loadScene(element: ElementRef) {
    let subject = new Subject();
    let manager = new THREE.LoadingManager();
    let loader = new THREE.FontLoader(manager);

    let fonts = [];
    let store = Store.getInstance();
    store.getFontTypes().forEach((item, index, array) => {
      loader.load(`../../assets/fonts/${item.fontName}_${item.fontWeight}.typeface.json`, (response) => {
        fonts.push(response);
      });
    });
    manager.onLoad = () => { // when all resources are loaded
      store.Fonts = fonts;
      this.sceneCanvasElement = element;
      this.init();
      this.animate();
      subject.next();
    };
    return subject.asObservable();
  }

  stopScene() {
    if (this.scene) {
      this.stopSceneAnimation = true;
      this.renderer.clear();
      this.sceneCanvasElement.nativeElement.removeChild(this.renderer.domElement);
      this.renderer = null;
      this.scene = null;
      this.group = null;
      this.camera = null;
    }
  }

  addObject(object: THREE.Object3D) {
    if (this.group) {
      this.group.add(object);
    }
  }
  init() {
    // CAMERA
    this.camera = new THREE.PerspectiveCamera(50,
      this.sceneCanvasElement.nativeElement.offsetWidth / this.sceneCanvasElement.nativeElement.offsetHeight, 0.001, 10);
    this.camera.position.set(0, 0.6, 3);
    this.cameraTarget = new THREE.Vector3(0, 0.6, 0);

    // window
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );


    // SCENE
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('white');

    // group
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // LIGHTS
    // to add light over text
    // const dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
    // dirLight.position.set(0, 0, 1).normalize();
    // this.group.add(dirLight);
    // const pointLight = new THREE.PointLight(0xffffff, 1.5);
    // pointLight.position.set(0, 4, 0);
    // this.group.add(pointLight);

    // RAYCASTER
    this.rayCaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.sceneCanvasElement.nativeElement.offsetWidth, this.sceneCanvasElement.nativeElement.offsetHeight);
    this.renderer.localClippingEnabled = true;
    this.sceneCanvasElement.nativeElement.appendChild(this.renderer.domElement);

    this.eventListeners['mousedown'] = this.onDocumentMouseDown.bind(this);
    this.eventListeners['mousemove'] = this.onDocumentMouseMove.bind(this);
    this.eventListeners['mouseup'] = this.onDocumentMouseUp.bind(this);
    this.eventListeners['mouseout'] = this.onDocumentMouseOut.bind(this);

    this.sceneCanvasElement.nativeElement.addEventListener('mousedown', this.eventListeners['mousedown'], false);
    this.sceneCanvasElement.nativeElement.addEventListener('mousemove', this.eventListeners['mousemove'], false);
    // this.sceneCanvasElement.nativeElement.addEventListener('touchstart', this.onDocumentTouchStart, false);
    // this.sceneCanvasElement.nativeElement.addEventListener('touchmove', this.onDocumentTouchMove, false);
  }
  onDocumentMouseDown(event) {
    event.preventDefault();
    this.mouseDown = true;
    this.sceneCanvasElement.nativeElement.addEventListener('mouseup', this.eventListeners['mouseup'], false);
    this.sceneCanvasElement.nativeElement.addEventListener('mouseout', this.eventListeners['mouseout'], false);

    // this.getPoint();
    // this.setPoint();
    // const intersections = this.rayCaster.intersectObjects(this.colliders, true);
    // this.listenEvents.next(intersections);
    this.mouseXOnMouseDown = event.clientX - (this.sceneCanvasElement.nativeElement.clientWidth / 2.00);
    this.targetRotationOnMouseDown = this.targetRotation;

  }

  getPoint() {
    this.planeNormal.copy(this.camera.position).normalize();
    this.plane.setFromNormalAndCoplanarPoint(this.planeNormal, this.group.position);
    this.rayCaster.setFromCamera(this.mouse, this.camera);
    this.rayCaster.ray.intersectPlane(this.plane, this.point);
  }
  setPoint() {
    let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.1, 4, 2), new THREE.MeshBasicMaterial({
      color: "yellow",
      wireframe: true
    }));
    sphere.position.copy(this.point);
    this.group.add(sphere);
  }

  onWindowResize() {
    this.camera.aspect = this.sceneCanvasElement.nativeElement.offsetWidth / this.sceneCanvasElement.nativeElement.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.sceneCanvasElement.nativeElement.offsetWidth, this.sceneCanvasElement.nativeElement.offsetHeight );
  }


  onDocumentMouseMove(event) {
    if (this.mouseDown) {
      this.mouseX = event.clientX - (this.sceneCanvasElement.nativeElement.clientWidth / 2.00);
      this.targetRotation = this.targetRotationOnMouseDown + (this.mouseX - this.mouseXOnMouseDown) * 0.02;
    }
    this.mouse.x = (event.clientX / this.sceneCanvasElement.nativeElement.offsetWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / this.sceneCanvasElement.nativeElement.offsetHeight) * 2 + 1;
    this.rayCaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.rayCaster.intersectObjects(this.colliders, true);
    this.listenEvents.next(intersects);
    if (intersects.length > 0) {
      // if the closest object intersected is not the currently stored intersection object
      if (intersects[0].object !== this.INTERSECTED) {
        // restore previous intersection object (if it exists) to its original color
        if (this.INTERSECTED) {
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
        }
        // store reference to closest object as current intersection object
        this.INTERSECTED = intersects[0].object;
        // store color of closest object (for later restoration)
        this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
        // set a new color for closest object
        this.INTERSECTED.material.color.setHex('blue');
      }
    } else // there are no intersections
    {
      // restore previous intersection object (if it exists) to its original color
      if (this.INTERSECTED) {
        this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
      }

      // remove previous intersection object reference
      //     by setting current intersection object to "nothing"
      this.INTERSECTED = null;
    }
  }

  onDocumentMouseUp() {
    this.mouseDown = false;
    // this.sceneCanvasElement.nativeElement.removeEventListener('mousemove', this.eventListeners['mousemove'], false);
    this.sceneCanvasElement.nativeElement.removeEventListener('mouseup', this.eventListeners['mouseup'], false);
    this.sceneCanvasElement.nativeElement.removeEventListener('mouseout', this.eventListeners['mouseout'], false);
  }

  onDocumentMouseOut() {
    this.mouseDown = false;
    // this.sceneCanvasElement.nativeElement.removeEventListener('mousemove', this.eventListeners['mousemove'], false);
    this.sceneCanvasElement.nativeElement.removeEventListener('mouseup', this.eventListeners['mouseup'], false);
    this.sceneCanvasElement.nativeElement.removeEventListener('mouseout', this.eventListeners['mouseout'], false);
  }

  animate() {
    if (!this.stopSceneAnimation) {
      requestAnimationFrame(() => this.animate());
      this.render();
    }
  }

  render() {
    if (this.group) {
      this.group.rotation.y += (this.targetRotation - this.group.rotation.y) * 0.05;
    }
    this.camera.lookAt(this.cameraTarget);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }

  submitColliders(colliders) {
    this.colliders = colliders;
  }

}
