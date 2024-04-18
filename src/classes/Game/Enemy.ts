import gsap from "gsap";
import { Point, Sprite } from "pixi.js";
import HealthBar from "./HealthBar";
import CollisionBox from "./CollisionBox";

let enemyId = 0;

class Enemy {
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  id: string = enemyId + "_enemy";

  canAttack: boolean = true;

  sprite: Sprite;
  collisionBox: CollisionBox;

  isAlive: boolean = true;

  healthBar: HealthBar;

  onDeath: callbackFn | undefined;

  constructor(sprite: Sprite, startPosition: Point, EndPosition: Point, enemyInfo: EnemyData) {
    enemyId++;
    this.health = enemyInfo.health;
    this.maxHealth = enemyInfo.health;
    this.damage = enemyInfo.damage;
    this.speed = enemyInfo.speed;

    const distance = EndPosition.subtract(startPosition).magnitude();

    let EnemySprite = sprite;
    EnemySprite.anchor.set(0.5);
    EnemySprite.scale.set(0.2);
    EnemySprite.label = `Enemy - ${enemyInfo.name}`;
    EnemySprite.position = startPosition;

    this.sprite = EnemySprite;

    this.healthBar = new HealthBar(EnemySprite);
    this.collisionBox = new CollisionBox(EnemySprite, 0 - EnemySprite.width * 2.5, 0 - EnemySprite.width * 2.5, EnemySprite.width * 5, EnemySprite.width * 5);

    gsap.to(EnemySprite.position, {
      x: EndPosition.x,
      y: EndPosition.y,
      duration: distance / enemyInfo.speed,
      ease: "none",
    });
  }

  takeDamage(damage: number): boolean {
    this.health = Math.max(this.health - damage, 0);

    gsap.fromTo(
      this.sprite,
      {
        tint: "red",
      },
      {
        tint: "white",
        duration: 0.15,
      }
    );

    this.healthBar.updateScale(this.health/this.maxHealth)

    if (this.health === 0) {
      this.isAlive = false;
      if (this.onDeath) {
        this.onDeath();
      }

      setTimeout(() => {
        this.sprite.destroy();
      }, 30);

      return true;
    }

    return false;
  }

  destroy() {
    this.isAlive = false;
    this.sprite.destroy();
  }
}

export default Enemy;
