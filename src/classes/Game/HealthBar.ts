import { Graphics, Sprite } from "pixi.js";

class HealthBar {
    healthBar: Graphics;

    constructor(parent: Sprite) {
        let healthBar = new Graphics()
        healthBar.label = "HealthBar"
        healthBar.rect(-(parent.width*3*0.33), -(parent.width*3*0.9), parent.width*3*0.8, parent.width*0.25)
        healthBar.fill("red")
        this.healthBar = healthBar

        parent.addChild(healthBar)
    }


    updateScale(newScale:number){
        this.healthBar.scale.set(newScale, 1)
    }

}

export default HealthBar