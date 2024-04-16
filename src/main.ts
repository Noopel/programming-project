import './style.scss'

import 'pixi.js/math-extras';

import characterData from "../assets/json/characterData.json"
import CharacterCard from './classes/CharacterCard'
import { Application, Assets } from 'pixi.js';
import Game from './classes/Game/Game';
import charData from "../assets/json/characterData.json"
import enemyData from "../assets/json/enemyData.json"
import GameStatistics from './classes/GameStatistics';

declare module globalThis {
 var __PIXI_APP__: Application;
}

const app = new Application();
globalThis.__PIXI_APP__ = app;

let assetBundle: {[key: string]: string} = {
  playButton: "../assets/img/playButton.png",
  bulletSprite: "../assets/img/bullet.png"

}

charData.characterList.forEach((charData) => {
  assetBundle[charData.name + "_sprite"] = `../assets/img/${charData.characterSprite}`
  assetBundle[charData.name + "_icon"] = `../assets/img/${charData.icon}`
});

enemyData.enemyList.forEach((enemData)=>{
  assetBundle[enemData.name + "_sprite"] = `../assets/img/${enemData.spriteName}`
  assetBundle[enemData.name + "_icon"] = `../assets/img/${enemData.icon}`
})

Assets.addBundle("assets", assetBundle);

(async()=>{
  /** I INVOKE THE 5TH */

  let cardCon = document.querySelector("#characterContainer") as HTMLElement;

  characterData.characterList.forEach((charData)=>{
    new CharacterCard(charData, cardCon)
  })

  let gameContainer = document.querySelector("#gameContainer") as HTMLElement;

  let width = gameContainer.clientWidth
  let aspectRatio = 16/9

  await app.init({width: Number(width), height: Number(width)/aspectRatio, manageImports: true})

  window.onresize = function(_event) {
    app.renderer.resize(Number(gameContainer.clientWidth), Number(gameContainer.clientWidth)/aspectRatio)
    
  }
  

  gameContainer.appendChild(app.canvas)
  
  const assets = await Assets.loadBundle('assets');

  console.log(assets)

  const gameStatistics = new GameStatistics({characterList: charData.characterList, enemyList: enemyData.enemyList});

  new Game(app, assets, {characterList: charData.characterList, enemyList: enemyData.enemyList}, (gameSessions: SessionData[])=>{
    gameStatistics.updateCharts(gameSessions[gameSessions.length-1])
  })

  let main = document.querySelector("main") as HTMLElement;
  gameStatistics.setParent(main)


})()
