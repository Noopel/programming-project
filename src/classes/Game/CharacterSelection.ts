import { Container, Sprite, Text } from "pixi.js";
import { SpriteOnHover } from "../UI/SpriteHover";
import Game from "./Game";

class CharacterSelection {
  constructor(game: Game, parent: Container, gameData: GameData, callbackFn: selectionCallback) {
    
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
    let debounce = false

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
        if(debounce){charSprite.eventMode = "none"; return}
        debounce = true
        charSprite.eventMode = "none"

        callbackFn(charInfo)
      })
    });
  }
}

export default CharacterSelection;
