import { Application, Graphics, Sprite } from "pixi.js";
import MainMenu from "./MainMenu";
import gsap from "gsap";
import StageManager from "./StageManager";

class Game {
  app: Application;
  assets: any;
  gameData: GameData;

  constructor(app: Application, assets: any, gameData: GameData) {
    this.app = app;
    this.assets = assets;
    this.gameData = gameData;

    const transition = new Graphics();
    transition.rect(0, 0, app.canvas.width, app.canvas.height);
    transition.fill("0x1d1d1d");
    transition.label = "Transition";
    transition.alpha = 0;
    transition.zIndex = 5;
    app.stage.addChild(transition);

    const stageManager = new StageManager(this);

    const mainMenu = new MainMenu(this, gameData, (charInfo) => {
      gsap.to(transition, {
        alpha: 1,
        duration: 0.5,
        onComplete: () => {
          mainMenu.menu.alpha = 0;
          mainMenu.menu.visible = false;

          stageManager.loadStage(charInfo);

          gsap.to(transition, {
            alpha: 0,
            duration: 0.5,
          });
        },
      });
    });

    let acrid = new Sprite(assets.acrid);
    acrid.scale.set(0.25);
    app.stage.addChild(acrid);

    app.ticker.add((_ticker) => {
      console.log("TICK");
    });
  }

  addChild(child: any) {
    this.app.stage.addChild(child)
  }

  getCanvasMidPoint() {
    return {x: this.app.canvas.width/2, y: this.app.canvas.height/2}
  }

  get canvasWidth() {
    return this.app.canvas.width
  }

  get canvasHeight() {
    return this.app.canvas.height
  }
}

export default Game;
