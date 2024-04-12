import gsap from "gsap";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import CharacterSelection from "./CharacterSelection";
import { SpriteOnHover } from "../UI/SpriteHover";
import Game from "./Game";

class MainMenu {
    menu: Container;
  playButton: Sprite;

  constructor(game: Game, gameData: GameData, startGameFn: selectionCallback) {
    const mainMenu = new Container({ width: game.canvasWidth, height: game.canvasHeight });
    mainMenu.sortableChildren = true;
    mainMenu.label = "MainMenu";
    this.menu = mainMenu

    let bg = new Graphics();
    bg.rect(0, 0, game.canvasWidth, game.canvasHeight);
    bg.fill("0x2d3e58");
    bg.label = "Main menu - Background"

    const appOffset = game.getCanvasMidPoint();

    let titleLabel = new Text();
    titleLabel.label = "Main menu - Title"
    titleLabel.zIndex = 2;
    titleLabel.anchor.set(0.5);
    titleLabel.style.fontSize = 50;
    titleLabel.style.fontWeight = "bold";
    titleLabel.style.stroke = "black";
    titleLabel.style.fill = "white";
    titleLabel.position = { x: appOffset.x, y: appOffset.y - appOffset.y / 1.75 };
    titleLabel.text = "Rainy Day 2";

    let playButton = new Sprite(game.assets.playButton);
    playButton.label = "Play button"
    playButton.zIndex = 2;
    playButton.anchor.set(0.5);
    playButton.position = { x: appOffset.x, y: appOffset.y + appOffset.y / 6 };

    SpriteOnHover(playButton)
    
    playButton.addEventListener("pointerdown", (event)=>{
        event.stopPropagation()
        playButton.eventMode = "none"
        
        mainMenu.children.forEach((child)=>{
          if(child instanceof Graphics){return}
          gsap.to(child, {
            alpha: 0,
            duration: 0.25,
          })
        })

        setTimeout(()=>{
            new CharacterSelection(game, mainMenu, gameData, startGameFn)
        }, 300)
      })

    playButton.eventMode = "static";
    this.playButton = playButton;

    mainMenu.addChild(playButton);
    mainMenu.addChild(titleLabel);
    mainMenu.addChild(bg);
    game.addChild(mainMenu);
  }
}

export default MainMenu;
