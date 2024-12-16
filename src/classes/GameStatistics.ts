import Chart from "chart.js/auto";
import CustomElement from "./CustomClasses/CustomElement";

class GameStatistics {
  container: CustomElement;
  gameData: GameData;

  killStatistic: CustomElement;
  timeStatistic: CustomElement;
  survivorStatistic: CustomElement;

  killChart: Chart;
  timeChart: Chart;
  survivorChart: Chart<"pie", number[], string>;

  currentChart: CustomElement | undefined;

  constructor(gameData: GameData) {
    this.gameData = gameData;

    const container = new CustomElement({ type: "article", id: "statisticsContainer" });
    this.container = container;

    new CustomElement({ type: "h1", innerText: "Statistics" }, container);
    const buttonMenu = new CustomElement({ type: "section", id: "statisticButtonMenu" }, container);

    const killCon = new CustomElement({ type: "section", id: "killStatistic", class: "statistics" }, container);
    const timeCon = new CustomElement({ type: "section", id: "timeStatistic", class: "statistics" }, container);
    const survCon = new CustomElement({ type: "section", id: "survivorStatistic", class: "statistics" }, container);
    killCon.visible = false;
    timeCon.visible = false;
    survCon.visible = false;

    this.killStatistic = new CustomElement({ type: "canvas" }, killCon);
    this.timeStatistic = new CustomElement({ type: "canvas" }, timeCon);
    this.survivorStatistic = new CustomElement({ type: "canvas" }, survCon);

    this.killChart = this.createChart(this.killStatistic.element as HTMLCanvasElement, "Number of kills");
    this.timeChart = this.createChart(this.timeStatistic.element as HTMLCanvasElement, "Seconds survived");
    this.survivorChart = new Chart(this.survivorStatistic.element as HTMLCanvasElement, {
      type: "pie",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Survivor pick rate",
            color: "white"
          },
        },
       color: "white"
      },
    });

    gameData.characterList.forEach((charInfo) => {
      this.survivorChart.data.labels?.push(charInfo.name);
      this.survivorChart.data.datasets[0].data.push(0);
    });

    const containerList = { Kills: killCon, "Time survived": timeCon, "Survivors picked": survCon };

    for (const [text, con] of Object.entries(containerList)) {
      const button = new CustomElement({ type: "button" }, buttonMenu);
      button.text = text;
      button.element.addEventListener("click", () => {
        console.log("Hello");
        if (this.currentChart != con) {
          this.activeChart = con;
        }
      });
    }

    this.activeChart = killCon;
  }

  set activeChart(newChart: CustomElement) {
    const oldChart = this.currentChart;
    if (oldChart) {
      oldChart.visible = false;
    }
    newChart.visible = true;
    this.currentChart = newChart;
  }

  setParent(elem: HTMLElement | Element) {
    this.container.setParentToDOM(elem);
  }

  createChart(canvas: HTMLCanvasElement, label: string) {
    let chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: label,
            data: [],
            borderWidth: 1,
          },
        ],
      },
      options: {
        animation: false,
        color: "white",

        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "white",
            },
            grid: {
              color: "rgb(41, 41, 41)",
            },
          },
          x: {
            ticks: {
              color: "white",
            },
            grid: {
              color: "rgb(41, 41, 41)",
            },
          },
        },
        backgroundColor: "rgb(17, 153, 188)",
      },
    });
    return chart;
  }

  updateCharts(gameSessions: SessionData) {
    this.killChart.data.labels?.push("Round " + (this.killChart.data.labels.length + 1));
    this.killChart.data.datasets[0].data.push(gameSessions.kills);

    this.timeChart.data.labels?.push("Round " + (this.timeChart.data.labels.length + 1));
    this.timeChart.data.datasets[0].data.push(Math.floor(gameSessions.timePassed / 60));

    let index = this.gameData.characterList.findIndex((charInfo) => {
      return charInfo.name === gameSessions.survivor;
    });
    let chartArray = this.survivorChart.data.datasets[0].data as [number];
    chartArray[index] += 1;

    /** Update charts */
    this.killChart.update();
    this.timeChart.update();
    this.survivorChart.update();
  }
}

export default GameStatistics;
