import CustomElement from "./CustomClasses/CustomElement"

const isProd = import.meta.env.PROD
const base = import.meta.env.BASE_URL
const imagePath = (isProd ? base : "") + "assets/img/"

class EnemyGrid {
    constructor(enemyList: EnemyData[], parent: HTMLElement | Element) {
        const grid = new CustomElement({type: "section", id: "enemyGridContainer"}, parent)

        enemyList.forEach((enemyInfo)=>{
            const gridItem = new CustomElement({type: "div", class: "gridItem"}, grid)

            new CustomElement({type: "img", class: "enemyImage", attributes: {src: imagePath+enemyInfo.spriteName}}, gridItem)
            const nameThreatCon = new CustomElement({type: "div", class: "nameThreatContainer"}, gridItem)

            new CustomElement({type: "figure", children: [
                {type: "img", class: "threatImage", attributes: {src: imagePath+`threat${enemyInfo.threat}.png`, title: "Threat Level "+enemyInfo.threat}}
            ]}, nameThreatCon)
            new CustomElement({type: "h4", class: "enemyName", innerText: enemyInfo.name}, nameThreatCon)
        })

    }
}

export default EnemyGrid