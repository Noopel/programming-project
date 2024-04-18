import gsap from "gsap";
import { Container, Point, Sprite } from "pixi.js";
import CollisionBox from "./CollisionBox";

let projectileId = 0;

class Projectile {
  id: string = projectileId + "_bullet";
  onDeath: any;
  collisionBox: CollisionBox;
  sprite: Sprite;

  damage: number;

  constructor(startPosition: Point, direction: Point, damage: number, sprite: Sprite, stageContainer: Container) {
    projectileId++;

    this.damage = damage

    const BULLET_LIFETIME = 5;
    const VELOCITY = 400;
    const endPosition = startPosition.add(direction.multiply(new Point(VELOCITY * BULLET_LIFETIME, VELOCITY * BULLET_LIFETIME)));

    let bulletSprite = sprite;
    bulletSprite.anchor.set(0.5);
    bulletSprite.scale.set(0.2);
    bulletSprite.zIndex = 6;
    bulletSprite.position = startPosition;
    bulletSprite.rotation = Math.atan2(direction.y, direction.x);
    bulletSprite.angle += 90;

    this.sprite = bulletSprite;
    
    this.collisionBox = new CollisionBox(bulletSprite, 0 - bulletSprite.width * 0.8 * (1 + bulletSprite.anchor.x), 0 - bulletSprite.height * 1.9 * (1 + bulletSprite.anchor.y), 128, 128);

    stageContainer.addChild(bulletSprite);

    gsap.to(bulletSprite.position, {
      x: endPosition.x,
      y: endPosition.y,
      duration: BULLET_LIFETIME,
      ease: "none",
      onComplete: () => {
        if (this.onDeath) {
          this.onDeath();
        }
        bulletSprite.destroy();
      },
    });
  }

  destroy() {
    if (this.onDeath) {
      this.onDeath();
    }
    this.sprite.destroy();
  }
}

export default Projectile;
