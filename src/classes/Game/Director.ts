import { Container, Point, Sprite } from "pixi.js";
import setRandomInterval from "set-random-interval";
import Game from "./Game";
import Enemy from "./Enemy";

class Director {
    game: Game;
    enemyDataList: EnemyData[];
    currentStage: Container | undefined;
    intervalFn: {clear: ()=>void} | undefined;
    centerPoint: Point;

    constructor(game: Game, enemyDataList: EnemyData[]) {
        this.game = game;
        this.enemyDataList = enemyDataList;
        this.centerPoint = new Point(game.getCanvasMidPoint().x, game.getCanvasMidPoint().y)
    }

    startDirecting(newStage: Container) {
        function weighted_random(options: EnemyData[]) {
            var i;
        
            var weights = [options[0].weight];
        
            for (i = 1; i < options.length; i++)
                weights[i] = options[i].weight + weights[i - 1];
            
            var random = Math.random() * weights[weights.length - 1];
            
            for (i = 0; i < weights.length; i++)
                if (weights[i] > random)
                    break;
            
            return options[i];
        }

        this.currentStage = newStage
        this.intervalFn = setRandomInterval(()=>{
            if(!this.currentStage){this.intervalFn?.clear(); this.intervalFn = undefined; return}
            if(Object.values(this.game.enemyList).length > 20){return}

            let validEnemiesToSpawn: EnemyData[] = []

            this.enemyDataList.forEach((enemyInfo)=>{
                if(this.game.currentSession && (this.game.currentSession.timePassed/60) > enemyInfo.timeUntilSpawnable) {
                    validEnemiesToSpawn.push(enemyInfo)
                }
            })

            console.log(validEnemiesToSpawn)

            let enemyData = weighted_random(validEnemiesToSpawn)

            const sprite = new Sprite(this.game.assets[enemyData.name+"_sprite"])
            
            const sides = [-1, 1]

            let initialPosition = new Point((this.game.canvasWidth/2)+600*sides[Math.round(Math.random())], Math.floor(Math.random()*700));

            let enemy = new Enemy(sprite, initialPosition, this.centerPoint, enemyData)
            this.currentStage.addChild(sprite)
            enemy.onDeath = () => {
                delete this.game.enemyList[enemy.id]
            }
            this.game.enemyList[enemy.id] = enemy
        }, 1000, 2000)
    }

    stopDirecting() {
        this.currentStage = undefined;
        this.intervalFn?.clear()
        this.intervalFn = undefined
    }
}

export default Director