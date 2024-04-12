import './style.scss'

import characterData from "../assets/json/characterData.json"
import CharacterCard from './classes/CharacterCard'
import { Application, Assets } from 'pixi.js';
import Game from './classes/Game/Game';
import charData from "../assets/json/characterData.json"
import enemyData from "../assets/json/enemyData.json"

declare module globalThis {
 var __PIXI_APP__: Application;
}

const app = new Application();
globalThis.__PIXI_APP__ = app;

let assetBundle: {[key: string]: string} = {
  playButton: "../assets/img/playButton.png"
}

charData.characterList.forEach((charData) => {
  assetBundle[charData.name + "_sprite"] = `../assets/img/${charData.characterSprite}`
  assetBundle[charData.name + "_icon"] = `../assets/img/${charData.icon}`
});

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

  await app.init({width: Number(width), height: Number(width)/aspectRatio})

  window.onresize = function(_event) {
    app.renderer.resize(Number(width), Number(width)/aspectRatio)
  }
  

  gameContainer.appendChild(app.canvas)
  
  const assets = await Assets.loadBundle('assets');

  console.log(assets)

  new Game(app, assets, {characterList: charData.characterList, enemyList: enemyData.enemyList})


})()
