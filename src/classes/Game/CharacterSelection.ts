import { Container, Sprite, Text } from "pixi.js";
import { SpriteOnHover } from "../UI/SpriteHover";
import Game from "./Game";

class CharacterSelection {
  charSprites: Sprite[] = [];
  container: Container
  debounce: boolean = false;

  constructor(game: Game, parent: Container, gameData: GameData, callbackFn: selectionCallback | undefined) {
    this.container = parent

    const appOffset = game.getCanvasMidPoint();

    let titleLabel = new Text();
    titleLabel.label = "Character selection"
    titleLabel.zIndex = 2;
    titleLabel.anchor.set(0.5);
    titleLabel.style.fontSize = 50;
    titleLabel.style.fontWeight = "bold";
    titleLabel.style.stroke = "black";
    titleLabel.style.fill = "white";
    titleLabel.position = { x: appOffset.x, y: appOffset.y - appOffset.y / 1.75 };
    titleLabel.text = "Select a survivor";

    parent.addChild(titleLabel)

    const GAP = 20;

    gameData.characterList.forEach((charInfo, index) => {
      const charSprite = new Sprite(game.assets[`${charInfo.name}_sprite`]);
      charSprite.label = "Character - " + charInfo.name
      charSprite.anchor.set(0.5);
      charSprite.scale.set(0.4);

      let position = game.getCanvasMidPoint()
      position.x += ((index - 1) * charSprite.width + GAP * (index - 1))
      charSprite.position = position;
      
      charSprite.zIndex = 5;
      parent.addChild(charSprite);
      SpriteOnHover(charSprite)

      charSprite.eventMode = "static"
      charSprite.addEventListener("click", ()=>{
        if(this.debounce){charSprite.eventMode = "none"; return}
        this.debounce = true
        charSprite.eventMode = "none"

        if(callbackFn) {
          callbackFn(charInfo)
        }
      })

      this.charSprites.push(charSprite)
    });
  }

  reset() {
    this.debounce = false
    this.charSprites.forEach((sprite)=>{
      sprite.eventMode = "static"
    })
  }
}

export default CharacterSelection;
