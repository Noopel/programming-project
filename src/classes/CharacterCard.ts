import CustomElement from "./CustomClasses/CustomElement";

class CharacterCard {
  static imagePath = "/assets/img/"

  cardElement: CustomElement;

  constructor(charData: CharacterInfo, parent: CustomElement | Element) {
    const cardElement = new CustomElement({ type: "section", class: ["card"] }, parent);

    new CustomElement({ type: "h1", innerText: charData.name, class: ["card__name"] }, cardElement);

    let figure = new CustomElement({type: "figure", class: ["card__figure"]}, cardElement)

    new CustomElement(
      { type: "img", class: ["card__image"], attributes: { src: CharacterCard.imagePath + charData.icon } },
      figure
    );

    new CustomElement(
      { type: "p", innerText: charData.description, class: ["card__desc"] },
      cardElement
    );

    const ul = new CustomElement({ type: "ul", class: ["card__statList"] }, cardElement);

    const stats = [
      { name: "health", format: ` Health: `, iconClass: "bi-suit-heart-fill" },
      { name: "damage", format: ` Damage: `, iconClass: "bi-fire" },
      { name: "speed", format: ` Speed: `, iconClass: "bi-lightning-charge-fill" },
    ];

    stats.forEach((stat) => {
      const statElement = new CustomElement(
        { type: "li", class: ["card__stat", "card__stat--" + stat.name] },
        ul
      );
      new CustomElement(
        { type: "i", class: ["bi", stat.iconClass] },
        statElement
      );
      new CustomElement(
        {
          type: "p",
          innerText: stat.format + String(charData[stat.name]),
        },
        statElement
      );
    });

    this.cardElement = cardElement;
  }
}

export default CharacterCard;
