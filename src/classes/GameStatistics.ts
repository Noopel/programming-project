import CustomElement from "./CustomClasses/CustomElement";

class GameStatistics{
    container: CustomElement;
    
    killStatistic: CustomElement;
    timeStatistic: CustomElement;
    survivorStatistic: CustomElement;

    constructor() {
        
        const container = new CustomElement({type: "article", id: "statisticsContainer"})
        this.container = container

        this.killStatistic = new CustomElement({type: "canvas", id: "killStatistic", class: "statistics"}, container)
        this.timeStatistic = new CustomElement({type: "canvas", id: "timeStatistic", class: "statistics"}, container)
        this.survivorStatistic = new CustomElement({type: "canvas", id: "survivorStatistic", class: "statistics"}, container)
    }

    setParent(elem: HTMLElement | Element) {
        this.container.setParentToDOM(elem)
    }

    update(gameSessions: SessionData[]) {

    }
}

export default GameStatistics