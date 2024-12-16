import "./style.scss";

import "pixi.js/math-extras";

import characterData from "../src/json/characterData.json";
import CharacterCard from "./classes/CharacterCard";
import { Application, Assets } from "pixi.js";
import Game from "./classes/Game/Game";
import charData from "../src/json/characterData.json";
import enemyData from "../src/json/enemyData.json";
import GameStatistics from "./classes/GameStatistics";
import EnemyGrid from "./classes/EnemyGrid";

declare namespace globalThis {
  var __PIXI_APP__: Application;
}

const app = new Application();
globalThis.__PIXI_APP__ = app;

let assetBundle: { [key: string]: string } = {
  playButton: "/assets/img/playbutton.png",
  bulletSprite: "/assets/img/bullet.png",
};

/** Create bundle data for each character */
charData.characterList.forEach((charData) => {
  assetBundle[charData.name + "_sprite"] = `/assets/img/${charData.characterSprite}`;
  assetBundle[charData.name + "_icon"] = `/assets/img/${charData.icon}`;
});

/** Create bundle data for each enemy */
enemyData.enemyList.forEach((enemData) => {
  assetBundle[enemData.name + "_sprite"] = `/assets/img/${enemData.spriteName}`;
  assetBundle[enemData.name + "_icon"] = `/assets/img/${enemData.icon}`;
});

Assets.addBundle("assets", assetBundle);

(async () => {
  /** Setting up character cards */
  let cardCon = document.querySelector("#characterContainer") as HTMLElement;
  characterData.characterList.forEach((charData) => {
    new CharacterCard(charData, cardCon);
  });

  /** Setting up enemy grid */
  let gridCon = document.querySelector("#enemyContainer") as HTMLElement;
  new EnemyGrid(enemyData.enemyList, gridCon);

  /** Creates game canvas */
  let gameContainer = document.querySelector("#gameContainer") as HTMLElement;

  let width = gameContainer.clientWidth;
  let aspectRatio = 16 / 9;

  /** Initialize app and add window resizer */
  await app.init({ width: Number(width), height: Number(width) / aspectRatio, manageImports: true });
  window.onresize = function (_event) {
    app.renderer.resize(Number(gameContainer.clientWidth), Number(gameContainer.clientWidth) / aspectRatio);
  };

  gameContainer.appendChild(app.canvas);

  /** Gets assets from bundle */
  const assets = await Assets.loadBundle("assets");

  console.log(assets);

  /** Pre-setup for GameStatistics so that it's updateCharts method can be sent to Game as a callback */
  const gameStatistics = new GameStatistics({ characterList: charData.characterList, enemyList: enemyData.enemyList });

  new Game(
    app,
    assets,
    { characterList: charData.characterList, enemyList: enemyData.enemyList },
    (gameSessions: SessionData[]) => {
      gameStatistics.updateCharts(gameSessions[gameSessions.length - 1]);
    }
  );

  /** Parent GameStatistics */
  let main = document.querySelector("main") as HTMLElement;
  gameStatistics.setParent(main);
})();
