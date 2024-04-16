import { Graphics } from "pixi.js";

export default class CollisionDetector {
    constructor() {}
    check(a: Graphics, b: Graphics) {
      let ab = a.getBounds();
      let bb = b.getBounds();
      return (
        ab.x + ab.width > bb.x &&
        ab.x < bb.x + bb.width &&
        ab.y + ab.height > bb.y &&
        ab.y < bb.y + bb.height
      );
    }
  }