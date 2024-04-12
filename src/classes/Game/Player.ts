import { Container, Sprite } from "pixi.js";
import Game from "./Game";

class Player {
    maxHealth: number;
    health: number;
    damage: number;
    speed: number;
    sprite: Sprite;

    isAlive: boolean = true;
    

    constructor(game: Game, charInfo: CharacterInfo, stageContainer: Container) {
        this.maxHealth = charInfo.health
        this.health = charInfo.health
        this.damage = charInfo.damage
        this.speed = charInfo.speed
        
        const charSprite = new Sprite(game.assets[charInfo.name+"_sprite"])
        charSprite.label = "Player"
        charSprite.zIndex = 5
        charSprite.anchor.set(0.5)
        charSprite.scale.set(0.20)
        charSprite.position = {x: game.app.canvas.width/2, y: game.app.canvas.height/2}
        stageContainer.addChild(charSprite)
        
        this.sprite = charSprite

    }
}

export default Player