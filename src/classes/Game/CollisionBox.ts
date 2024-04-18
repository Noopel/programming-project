import { Graphics, Sprite } from "pixi.js";

class CollisionBox {
    box: Graphics;
    
    constructor(parent: Sprite, x: number, y: number, w: number, h: number) {
        const newBox = new Graphics()
        newBox.label = "CollisionBox"
        newBox.rect(x, y, w, h)
        newBox.fill("rgba(255,0,0,0)")
        this.box = newBox
        parent.addChild(newBox)
    }
}

export default CollisionBox