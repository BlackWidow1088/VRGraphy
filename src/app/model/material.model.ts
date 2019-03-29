// THREE.Material is absctract class, so need to create the interface for strict checking
export interface Material {
  color?: string;
  opacity?: number;
  transparent?: boolean;

  linewidth?: number;
  wireframe?: boolean;
  visible?: boolean;
  canClipChildren?: boolean; // can clip the groups present in this group, so will calculate the clipping planes
  clippingPlanes?: any[];

  trackable?: boolean;
}
