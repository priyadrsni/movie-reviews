import Utilities from "./utilities.mjs";

class Cards extends Utilities{
  constructor() {
    super();
    this.cardsElement = document.querySelector(".cards");
  }

  getSingleCard(result, index) {
    const { display_title, display_name, multimedia } = result;
    const titleText = display_title ? display_title : display_name;

    const li = this.buildElement("li", {
      classes: ["card"],
      others: { "data-index": index },
    });
    const img = this.getImageElement(multimedia);
    const p = this.buildElement("p", { classes: ["title"] }, titleText);

    li.appendChild(img);
    li.appendChild(p);

    return li;
  }

  populateDataInCards(results) {
    if (results !== null) {
      results.forEach((result, index) => {
        this.cardsElement.appendChild(this.getSingleCard(result, index));
      });
    }
  }
}

export default Cards;
