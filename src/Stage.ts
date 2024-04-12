import { Application } from "pixi.js";

class Stage {
    app: Application;
    container: HTMLElement | Element;

    constructor(app: Application, container: HTMLElement | Element) {
        this.app = app
        this.container = container
        

    }
}

export default Stage