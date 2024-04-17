import { Application, Container, Graphics, Sprite } from "pixi.js";
import MainMenu from "./MainMenu";
import gsap from "gsap";
import StageManager from "./StageManager";
import Projectile from "./Projectile";
import Enemy from "./Enemy";
import Director from "./Director";
import CollisionDetector from "./CollisionDetector";
import Player from "./Player";

class Game {
  app: Application;
  assets: any;
  gameData: GameData;
  bulletList: {[key: string]: Projectile} = {};
  enemyList: {[key: string]: Enemy} = {};
  player: Player | undefined;

  gameSessions: SessionData[] = [];
  currentSession: undefined | SessionData;

  transition: Graphics;

  constructor(app: Application, assets: any, gameData: GameData, sessionEndedCallback: (sessionData: SessionData[])=>void) {
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
    this.transition = transition

    const collisionDetector = new CollisionDetector();
    const director = new Director(this, gameData.enemyList)
    const stageManager = new StageManager(this);

    const mainMenu = new MainMenu(this, gameData);
    mainMenu.characterSelected = (charInfo) => {
      console.log(charInfo)
      gsap.to(transition, {
        alpha: 1,
        duration: 0.5,
        onComplete: () => {
          mainMenu.mainMenu.alpha = 0;
          mainMenu.mainMenu.visible = false;

          let newStage = stageManager.loadStage(charInfo) as Container;
          director.startDirecting(newStage)
          this.player = stageManager.playerCharacter

          this.currentSession = {
            timePassed: 0,
            kills: 0,
            survivor: charInfo.name,
          }

          gsap.to(transition, {
            alpha: 0,
            duration: 0.5,
          });
        },
      });
    }

    stageManager.gameEnded = () => {
      console.log("Game ended")
      this.gameSessions.push(this.currentSession as SessionData)
      this.currentSession = undefined;
      director.stopDirecting()
      this.player = undefined;
      mainMenu.reset()
      for(const[, enemy] of Object.entries(this.enemyList)) {
        enemy.destroy()
      }
      this.enemyList = {}
      Object.values(this.bulletList).forEach((bullet)=>{
        bullet.destroy()
      })
      this.bulletList = {}
      this.setTransitionState(0, undefined)

      sessionEndedCallback(this.gameSessions)
    } 

    let acrid = new Sprite(assets.acrid);
    acrid.scale.set(0.25);
    app.stage.addChild(acrid);

    //Physics handler
    app.ticker.add((_ticker) => {
      if(!stageManager.currentStage){return}
      if(this.currentSession){this.currentSession.timePassed+=_ticker.deltaTime}
      let enemies = Object.values(this.enemyList)
      if(enemies.length === 0) {return}

      enemies.forEach((enemy)=>{
        if(!enemy.isAlive){return}
        let bullets = Object.values(this.bulletList)
        if(bullets.length === 0 && !this.player){return}

        /** Bullet collisions! */
        bullets.forEach((bullet)=>{
          if(!collisionDetector.check(enemy.collisionBox, bullet.collisionBox)){return}
          if(!enemy.isAlive){return}
          let died = enemy.takeDamage(bullet.damage)
          if(died && this.currentSession){this.currentSession.kills++}
          bullet.destroy()
          console.log("Collision detected!")
        })

        /** If bullet didn't kill enemy then we'll check for player collision */
        if(!this.player || !this.player.isAlive || !collisionDetector.check(enemy.collisionBox, this.player.collisionBox)) {return}
        if(!enemy.canAttack || !enemy.isAlive){return}
        console.log("Player took " + enemy.damage)
        console.log("Health left: " + (this.player.health-enemy.damage))
        enemy.canAttack = false
        this.player.takeDamage(enemy.damage)
        enemy.takeDamage(enemy.health+100)
      })
    });
  }

  setTransitionState(alpha: 1 | 0 = 0, onCompleteFn: (()=>void) | undefined) {
    gsap.to(this.transition, {
      alpha: alpha,
      duration: 0.5,
      onComplete: onCompleteFn
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
