interface EnemyData {
  name: string;
  health: number;
  damage: number;
  speed: number;

  threat: number;
  timeUntilSpawnable: number;
  weight: number;
  spriteName: string;
}

type CharacterInfo = {
  [key: string]: any;
  name: string;
  health: number;
  damage: number;
  speed: number;

  icon: string;
  description: string;

  characterSprite: string;
};

type GameData = {
  characterList: CharacterInfo[],
  enemyList: EnemyData[],
}

type SessionData = {
  timePassed: number;
  kills: number;
  survivor: string;
}

/** Custom */
type callbackFn = () => void;

interface ElementInfo {
  type: string;
  innerText?: string;
  id?: string;
  class?: string[] | string;
  attributes?: { [key: string]: string };
  children?: ElementInfo[];
  repeat?: number;
}

interface ElementQuery {
  classQuery: string | string[];
  id: string;
  type: string;
}

type selectionCallback = (charData: CharacterInfo) => void