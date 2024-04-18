import { Container, Sprite } from "pixi.js";
import Game from "./Game";
import Gun from "./Gun";
import gsap from "gsap";
import HealthBar from "./HealthBar";
import CollisionBox from "./CollisionBox";

class Player {
  maxHealth: number;
  health: number;
  damage: number;
  speed: number;
  sprite: Sprite;

  healthBar: HealthBar;

  isAlive: boolean = true;

  gun: Gun | undefined;
  collisionBox: CollisionBox;

  onDeath: (() => void) | undefined;

  constructor(game: Game, charInfo: CharacterInfo, stageContainer: Container) {
    this.maxHealth = charInfo.health;
    this.health = charInfo.health;
    this.damage = charInfo.damage;
    this.speed = charInfo.speed;

    const charSprite = new Sprite(game.assets[charInfo.name + "_sprite"]);
    charSprite.label = "Player";
    charSprite.zIndex = 5;
    charSprite.anchor.set(0.5);
    charSprite.scale.set(0.2);
    charSprite.position = { x: game.app.canvas.width / 2, y: game.app.canvas.height / 2 };
    stageContainer.addChild(charSprite);

    this.healthBar = new HealthBar(charSprite);

    this.collisionBox = new CollisionBox(charSprite, 0 - charSprite.width * 2.5, 0 - charSprite.width * 2.5, charSprite.width * 5, charSprite.width * 5);

    this.sprite = charSprite;

    const COOLDOWN = 30 / charInfo.speed;
    let onCooldown = false;

    this.gun = new Gun(game, stageContainer);

    stageContainer.eventMode = "static";
    stageContainer.addEventListener("click", (event) => {
      if (onCooldown) {
        return;
      }
      onCooldown = true;

      //Fire projectile
      let direction = event.global.subtract(charSprite.position).normalize();
      this.gun?.fire(charSprite.position, direction, charInfo.damage);

      gsap.to(charSprite.scale, {
        x: 0.21,
        y: 0.21,
        duration: 0.1,
        onComplete: () => {
          gsap.to(charSprite.scale, {
            x: 0.2,
            y: 0.2,
            duration: 0.1,
          });
        },
      });

      setTimeout(() => {
        onCooldown = false;
      }, COOLDOWN * 1000);
    });
  }

  takeDamage(amount: number) {
    let newHealth = Math.max(this.health - amount, 0);
    this.health = newHealth;

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

    this.healthBar.updateScale(newHealth/this.maxHealth)

    if (this.health === 0) {
      this.isAlive = false;
      if (this.onDeath) {
        this.onDeath();
      }
    }
  }

  destroy() {
    this.sprite.destroy();
    delete this.gun;
  }
}

export default Player;
