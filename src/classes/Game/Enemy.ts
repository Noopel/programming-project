import gsap from "gsap";
import { Color, Graphics, Point, Sprite } from "pixi.js";

let enemyId = 0

class Enemy {
  health: number;
  damage: number;
  speed: number;
  id: string = enemyId + "_enemy";

  canAttack: boolean = true;

  sprite: Sprite;
  collisionBox: Graphics;

  isAlive: boolean = true;

  onDeath: callbackFn | undefined;

  constructor(sprite: Sprite, startPosition: Point, EndPosition: Point, enemyInfo: EnemyData) {
    enemyId++
    this.health = enemyInfo.health;
    this.damage = enemyInfo.damage;
    this.speed = enemyInfo.speed;

    const distance = EndPosition.subtract(startPosition).magnitude()

    let EnemySprite = sprite;
    EnemySprite.anchor.set(0.5)
    EnemySprite.scale.set(0.2)
    EnemySprite.label = "Enemy - " + enemyInfo.name
    EnemySprite.position = startPosition;
    //EnemySprite.rotation = Math.atan2(direction.y, direction.x)

    this.sprite = EnemySprite;

    const collisionBox = new Graphics();
    collisionBox.rect(0-(EnemySprite.width*2.5), 0-(EnemySprite.width*2.5), EnemySprite.width*5, EnemySprite.width*5);

    collisionBox.fill(new Color("rgba(255, 0, 0, 0.25)"));
    this.collisionBox = collisionBox;
    EnemySprite.addChild(collisionBox);

    gsap.to(EnemySprite.position, {
      x: EndPosition.x,
      y: EndPosition.y,
      duration: (distance) / enemyInfo.speed,
      ease: "none"
    });
  }

  takeDamage(damage: number): boolean {
    this.health = Math.max(this.health - damage, 0);

    //Play on hit animation?

    if (this.health === 0) {
      this.isAlive = false;
      if (this.onDeath) {
        this.onDeath();
      }
      //Play animation?
      this.sprite.destroy();

      return true
    }

    return false
  }

  destroy() {
    this.isAlive = false;
    this.sprite.destroy()
  }
}

export default Enemy;
