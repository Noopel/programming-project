import { Container, Point, Sprite } from "pixi.js";
import Game from "./Game";
import Projectile from "./Projectile";

class Gun {
    game: Game;
    container: Container

    constructor(game: Game, stageContainer: Container) {
        this.game = game;
        this.container = new Container();
        this.container.label = "ProjectileContainer"
        stageContainer.addChild(this.container)
    }

    fire(startPosition: Point, direction: Point, damage: number) {
        const bulletSprite = new Sprite(this.game.assets.bulletSprite)
        bulletSprite.label = "Bullet"

        let bullet = new Projectile(startPosition, direction, damage, bulletSprite, this.container)
        bullet.onDeath = () => {
            delete this.game.bulletList[bullet.id]
        }
        this.game.bulletList[bullet.id] = bullet
    }
}

export default Gun