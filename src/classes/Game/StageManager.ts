import { Container, Graphics, Text } from "pixi.js";
import Player from "./Player";
import Game from "./Game";
import gsap from "gsap";

class StageManager {
  static stages = [
    [
      { name: "Distant Roost", color: "rgb(31, 164, 128)" },
      { name: "Titanic Plains", color: "rgb(17, 128, 69)" },
      { name: "Siphoned Forest", color: "rgb(64, 172, 188)" },
    ],
  ];

  game: Game;

  currentStage: Container | undefined;
  playerCharacter: Player | undefined;

  gameEnded: (() => void) | undefined;

  constructor(game: Game) {
    this.game = game;
  }

  loadStage(charInfo: CharacterInfo) {
    if (this.currentStage) {
      console.error("A stage is already running!");
      return;
    }
    let stageInfo = StageManager.stages[0][Math.round(Math.random() * (StageManager.stages[0].length - 1))];

    const stage = new Container();
    stage.label = "Stage - " + stageInfo.name;
    this.currentStage = stage;

    const bg = new Graphics();
    bg.label = "StageBackground"
    bg.rect(0, 0, this.game.canvasWidth, this.game.canvasHeight);
    bg.fill(stageInfo.color);
    stage.addChild(bg);

    const appOffset = this.game.getCanvasMidPoint();

    const stageLabel = new Text();
    stageLabel.label = "Main menu - Title";
    stageLabel.zIndex = 2;
    stageLabel.anchor.set(0.5);
    stageLabel.style.fontSize = 50;
    stageLabel.style.fontWeight = "bold";
    stageLabel.style.stroke = "black";
    stageLabel.style.fill = "white";
    stageLabel.position = { x: appOffset.x, y: appOffset.y - appOffset.y / 1.75 };
    stageLabel.text = stageInfo.name;

    stage.addChild(stageLabel)

    gsap.to(stageLabel, {
        alpha: 0,
        duration: 4,
        ease: "power2.in",
        onComplete: ()=>{
            stageLabel.destroy()
        }
    })

    this.game.app.stage.addChild(stage);

    this.playerCharacter = new Player(this.game, charInfo, stage);

    this.playerCharacter.onDeath = () => this.unloadStage();

    return stage;
  }

  unloadStage() {
    this.game.setTransitionState(1, () => {
      this.currentStage?.destroy();
      this.currentStage = undefined;
      this.playerCharacter?.destroy();
      delete this.playerCharacter;

      if (this.gameEnded) {
        this.gameEnded();
      }
    });
  }
}

export default StageManager;
