
import * as THREE from 'three';
export namespace MatrixManager {
  export function getTransformationMatrix(position: THREE.Vector3, rotation: THREE.Euler, scale: THREE.Vector3) {
    // Matrix.compose(position, rotation, scale);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(rotation);
    const mat = new THREE.Matrix4().compose(
      position,
      quaternion,
      scale
    );
    return mat;
  }
}
