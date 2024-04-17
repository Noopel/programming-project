import gsap from "gsap";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import CharacterSelection from "./CharacterSelection";
import { SpriteOnHover } from "../UI/SpriteHover";
import Game from "./Game";

class MainMenu {
  mainMenu: Container;
  playButton: Sprite;
  characterSelection: CharacterSelection;

  characterSelected: selectionCallback = ()=>{};

  constructor(game: Game, gameData: GameData) {
    const mainMenu = new Container({ width: game.canvasWidth, height: game.canvasHeight });
    mainMenu.sortableChildren = true;
    mainMenu.label = "MainMenu";
    this.mainMenu = mainMenu;

    let bg = new Graphics();
    bg.rect(0, 0, game.canvasWidth, game.canvasHeight);
    bg.fill("0x2d3e58");
    bg.label = "Main menu - Background";

    const appOffset = game.getCanvasMidPoint();

    let titleLabel = new Text();
    titleLabel.label = "Main menu - Title";
    titleLabel.zIndex = 2;
    titleLabel.anchor.set(0.5);
    titleLabel.style.fontSize = 50;
    titleLabel.style.fontWeight = "bold";
    titleLabel.style.stroke = "black";
    titleLabel.style.fill = "white";
    titleLabel.position = { x: appOffset.x, y: appOffset.y - appOffset.y / 1.75 };
    titleLabel.text = "Risk of Rain: Budget Edition";

    let playButton = new Sprite(game.assets.playButton);
    playButton.label = "Play button";
    playButton.zIndex = 2;
    playButton.anchor.set(0.5);
    playButton.position = { x: appOffset.x, y: appOffset.y + appOffset.y / 6 };

    const charSelectionContainer = new Container({ width: game.canvasWidth, height: game.canvasHeight });
    charSelectionContainer.label = "Character Selection";
    charSelectionContainer.sortableChildren = true;
    charSelectionContainer.visible = false;
    charSelectionContainer.zIndex = 2;
    mainMenu.addChild(charSelectionContainer)

    this.characterSelection = new CharacterSelection(game, charSelectionContainer, gameData, (charInfo)=>this.characterSelected(charInfo));

    SpriteOnHover(playButton);

    playButton.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      playButton.eventMode = "none";

      mainMenu.children.forEach((child) => {
        this.animateAlpha(child, 0);
      });

      setTimeout(()=>{
        charSelectionContainer.visible = true;
      }, 300)
    });

    playButton.eventMode = "static";
    this.playButton = playButton;

    mainMenu.addChild(playButton);
    mainMenu.addChild(titleLabel);
    mainMenu.addChild(bg);
    game.addChild(mainMenu);
  }

  animateAlpha(object: any, newAlpha: number) {
    if (object instanceof Graphics) {
      return;
    }
    if(object.label === "Character Selection") {return}
    
    gsap.to(object, {
      alpha: newAlpha,
      duration: 0.25,
    });
  }

  reset() {
    this.characterSelection.container.visible = false;
    this.mainMenu.alpha = 1;
    this.mainMenu.visible = true;
    this.mainMenu.children.forEach((child) => this.animateAlpha(child, 1));
    this.playButton.eventMode = "static";
    this.characterSelection?.reset();
  }
}

export default MainMenu;
