import { Container, Graphics } from "pixi.js";
import Enemy from "./Enemy";
import Player from "./Player";
import Game from "./Game";

class StageManager {
    static stages = [
        [{name: "Distant Roost"}, {name: "Titanic Plains"}, {name: "Siphoned Forest"}]
    ]

    game: Game;

    currentStage: Container | undefined;
    playerCharacter: Player | undefined;
    enemyList: Enemy[] = [];


    constructor(game: Game) {
        this.game = game
        
    }

    loadStage(charInfo: CharacterInfo) {
        if(this.currentStage){console.error("A stage is already running!"); return}
        let stageInfo = StageManager.stages[0][0]

        const stage = new Container()
        stage.label = "Stage - " + stageInfo.name

        const bg = new Graphics()
        bg.rect(0, 0, this.game.canvasWidth, this.game.canvasHeight)
        bg.fill("rgb(17, 128, 69)")
        stage.addChild(bg)

        this.game.app.stage.addChild(stage)

        this.playerCharacter = new Player(this.game, charInfo, stage)
    }

    unloadStage() {

    }

}

export default StageManager