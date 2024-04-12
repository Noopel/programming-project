import { Sprite } from "pixi.js";

export function SpriteOnHover(sprite: Sprite) {
  function addTint(tint: string) {
    sprite.tint = tint;
  }
  function removeTint() {
    sprite.tint = "0xffffff";
  }

  sprite.addEventListener("pointerenter", () => addTint("0xc8c8c8"));
  sprite.addEventListener("pointerdown", () => addTint("0x939393"));
  sprite.addEventListener("pointerup", () => addTint("0xc8c8c8"));
  sprite.addEventListener("pointerleave", removeTint);
}
